import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { MatchService } from '../match/match.service';
import { LobbyService } from '../lobby/lobby.service';
import { ChatService } from '../chat/chat.service';
import { PlayerService } from '../player/player.service';

@WebSocketGateway({ cors: true, namespace: '/' })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');

  constructor(
    private matchService: MatchService,
    private lobbyService: LobbyService,
    private chatService: ChatService,
    private playerService: PlayerService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Handle player disconnect - mark as offline, leave lobby if needed
  }

  @SubscribeMessage('joinLobby')
  async handleJoinLobby(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { lobbyId?: string; displayName: string; avatarId: string },
  ) {
    try {
      let lobbyId = payload.lobbyId;
      
      // Create or join lobby
      if (!lobbyId) {
        const lobby = await this.lobbyService.createLobby();
        lobbyId = lobby.id;
      }

      // Create or get player
      const player = await this.playerService.createGuestPlayer({
        displayName: payload.displayName,
        avatarId: payload.avatarId,
        lobbyId,
      });

      // Join the lobby
      await this.lobbyService.addPlayerToLobby(lobbyId, player.id);

      // Store player info in socket
      client.data.playerId = player.id;
      client.data.lobbyId = lobbyId;

      // Join socket room
      client.join(lobbyId);

      // Get updated lobby state
      const lobbyState = await this.lobbyService.getLobbyState(lobbyId);

      // Emit to all in lobby
      this.server.to(lobbyId).emit('lobbyUpdate', lobbyState);

      return { success: true, player, lobbyId };
    } catch (error) {
      this.logger.error(`Error joining lobby: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('leaveLobby')
  async handleLeaveLobby(@ConnectedSocket() client: Socket) {
    try {
      const playerId = client.data.playerId;
      const lobbyId = client.data.lobbyId;

      if (!playerId || !lobbyId) {
        return { success: false, error: 'Not in a lobby' };
      }

      await this.lobbyService.removePlayerFromLobby(lobbyId, playerId);
      client.leave(lobbyId);

      const lobbyState = await this.lobbyService.getLobbyState(lobbyId);
      this.server.to(lobbyId).emit('lobbyUpdate', lobbyState);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('setReady')
  async handleSetReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { isReady: boolean },
  ) {
    try {
      const playerId = client.data.playerId;
      const lobbyId = client.data.lobbyId;

      if (!playerId || !lobbyId) {
        return { success: false, error: 'Not in a lobby' };
      }

      const player = await this.lobbyService.setPlayerReady(lobbyId, playerId, payload.isReady);
      const lobbyState = await this.lobbyService.getLobbyState(lobbyId);

      // Check if all players are ready and we have enough players to start
      const allReady = lobbyState.players.every(p => p.isReady);
      const enoughPlayers = lobbyState.players.length >= lobbyState.minPlayers;

      if (allReady && enoughPlayers) {
        // Start match
        const match = await this.matchService.createMatch(lobbyId);
        
        // Emit match started to all players
        this.server.to(lobbyId).emit('matchStarted', match);
      } else {
        this.server.to(lobbyId).emit('lobbyUpdate', lobbyState);
      }

      return { success: true, player };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('submitWord')
  async handleSubmitWord(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { word: string },
  ) {
    try {
      const playerId = client.data.playerId;
      const lobbyId = client.data.lobbyId;

      if (!playerId || !lobbyId) {
        return { success: false, error: 'Not in a match' };
      }

      // Get the current match for this lobby
      const match = await this.matchService.getActiveMatch(lobbyId);

      if (!match) {
        return { success: false, error: 'No active match' };
      }

      const result = await this.matchService.submitWord(match.id, playerId, payload.word);

      // Emit result to all players in the match
      this.server.to(lobbyId).emit('wordSubmitResult', result);

      if (result.success && result.state) {
        // Emit updated match state
        this.server.to(lobbyId).emit('matchUpdate', result.state);
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('sendChatMessage')
  async handleSendChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { message: string; recipientId?: string },
  ) {
    try {
      const playerId = client.data.playerId;
      const lobbyId = client.data.lobbyId;

      if (!playerId) {
        return { success: false, error: 'Not authenticated' };
      }

      const messageData = await this.chatService.sendMessage({
        senderId: playerId,
        content: payload.message,
        lobbyId: payload.recipientId ? undefined : lobbyId,
        receiverId: payload.recipientId,
        messageType: payload.recipientId ? 'PRIVATE' : 'PUBLIC',
      });

      if (payload.recipientId) {
        // Private message - send only to recipient
        this.server.to(payload.recipientId).emit('privateMessage', messageData);
        // Also send back to sender
        client.emit('privateMessage', messageData);
      } else {
        // Public message - send to entire lobby
        this.server.to(lobbyId).emit('chatMessage', messageData);
      }

      return { success: true, message: messageData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getLeaderboard')
  async handleGetLeaderboard(@ConnectedSocket() client: Socket) {
    try {
      const leaderboard = await this.playerService.getLeaderboard(100);
      return { success: true, leaderboard };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('getPlayerStats')
  async handleGetPlayerStats(@ConnectedSocket() client: Socket) {
    try {
      const playerId = client.data.playerId;
      if (!playerId) {
        return { success: false, error: 'Not authenticated' };
      }

      const stats = await this.playerService.getPlayerStats(playerId);
      return { success: true, stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
