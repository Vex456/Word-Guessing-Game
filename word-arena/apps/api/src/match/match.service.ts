import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DictionaryService } from '../dictionary/dictionary.service';
import { MatchStatus, LobbyStatus } from '@prisma/client';

interface MatchState {
  id: string;
  lobbyId: string;
  letter: string;
  round: number;
  timerSeconds: number;
  currentTurnIndex: number;
  status: MatchStatus;
  players: Array<{
    id: string;
    playerId: string;
    displayName: string;
    avatarId: string;
    turnOrder: number;
    isEliminated: boolean;
    isSpectator: boolean;
  }>;
  usedWords: string[];
}

@Injectable()
export class MatchService {
  private activeMatches: Map<string, MatchState> = new Map();
  private turnTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private prisma: PrismaService,
    private dictionary: DictionaryService,
  ) {}

  async createMatch(lobbyId: string): Promise<MatchState> {
    const lobby = await this.prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: {
        players: {
          include: {
            avatar: true,
          },
        },
      },
    });

    if (!lobby || lobby.players.length < 2) {
      throw new BadRequestException('Not enough players to start match');
    }

    // Create match in database
    const letter = this.dictionary.getRandomLetter();
    const match = await this.prisma.match.create({
      data: {
        lobbyId,
        letter,
        status: MatchStatus.STARTING,
      },
      include: {
        lobby: true,
      },
    });

    // Create match players with random turn order
    const shuffledPlayers = [...lobby.players].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < shuffledPlayers.length; i++) {
      await this.prisma.matchPlayer.create({
        data: {
          matchId: match.id,
          playerId: shuffledPlayers[i].id,
          turnOrder: i,
        },
      });
    }

    // Initialize in-memory state
    const matchState: MatchState = {
      id: match.id,
      lobbyId,
      letter,
      round: 1,
      timerSeconds: 10,
      currentTurnIndex: 0,
      status: MatchStatus.IN_PROGRESS,
      players: shuffledPlayers.map((p, index) => ({
        id: p.id,
        playerId: p.id,
        displayName: p.displayName,
        avatarId: p.avatarId,
        turnOrder: index,
        isEliminated: false,
        isSpectator: false,
      })),
      usedWords: [],
    };

    this.activeMatches.set(match.id, matchState);
    await this.updateLobbyStatus(lobbyId, LobbyStatus.IN_PROGRESS);

    return matchState;
  }

  getMatch(matchId: string): MatchState | undefined {
    return this.activeMatches.get(matchId);
  }

  async submitWord(
    matchId: string,
    playerId: string,
    word: string,
  ): Promise<{ success: boolean; message: string; state?: MatchState }> {
    const match = this.activeMatches.get(matchId);
    
    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.status !== MatchStatus.IN_PROGRESS) {
      throw new BadRequestException('Match is not in progress');
    }

    const currentPlayer = match.players[match.currentTurnIndex];
    
    if (!currentPlayer || currentPlayer.playerId !== playerId) {
      throw new BadRequestException('Not your turn');
    }

    if (currentPlayer.isEliminated) {
      throw new BadRequestException('Player is eliminated');
    }

    // Validate word starts with correct letter
    if (!this.dictionary.startsWithLetter(word, match.letter)) {
      return {
        success: false,
        message: `Word must start with letter ${match.letter}`,
      };
    }

    // Validate word is in dictionary
    if (!this.dictionary.isValidWord(word)) {
      return {
        success: false,
        message: 'Invalid word',
      };
    }

    // Check for duplicates
    if (match.usedWords.includes(word.toLowerCase())) {
      return {
        success: false,
        message: 'Word already used',
      };
    }

    // Word is valid - record it
    const normalizedWord = word.toLowerCase();
    match.usedWords.push(normalizedWord);

    await this.prisma.usedWord.create({
      data: {
        matchId,
        matchPlayerId: currentPlayer.id,
        word: normalizedWord,
        round: match.round,
      },
    });

    await this.prisma.matchPlayer.update({
      where: { id: currentPlayer.id },
      data: {
        wordsSubmitted: { increment: 1 },
      },
    });

    // Award point for valid word
    await this.awardPoints(currentPlayer.playerId, 1);

    // Move to next player
    return this.moveToNextTurn(match);
  }

  private async moveToNextTurn(match: MatchState): Promise<{ success: boolean; message: string; state: MatchState }> {
    // Find next non-eliminated player
    let nextIndex = (match.currentTurnIndex + 1) % match.players.length;
    let loopsCompleted = 0;

    while (match.players[nextIndex]?.isEliminated && loopsCompleted < match.players.length) {
      nextIndex = (nextIndex + 1) % match.players.length;
      loopsCompleted++;
    }

    match.currentTurnIndex = nextIndex;

    // Check if only one player remains
    const activePlayers = match.players.filter(p => !p.isEliminated);
    
    if (activePlayers.length === 1) {
      await this.endMatch(match, activePlayers[0]);
      return {
        success: true,
        message: 'Game over',
        state: match,
      };
    }

    // Start timer for next player
    this.startTurnTimer(match);

    // Save state
    this.activeMatches.set(match.id, match);

    return {
      success: true,
      message: 'Turn moved',
      state: match,
    };
  }

  private startTurnTimer(match: MatchState) {
    // Clear existing timer
    const existingTimer = this.turnTimers.get(match.id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      await this.handleTurnTimeout(match);
    }, match.timerSeconds * 1000);

    this.turnTimers.set(match.id, timer);
  }

  private async handleTurnTimeout(match: MatchState) {
    const currentPlayer = match.players[match.currentTurnIndex];
    
    if (currentPlayer && !currentPlayer.isEliminated) {
      // Eliminate player
      currentPlayer.isEliminated = true;
      
      await this.prisma.matchPlayer.update({
        where: { id: currentPlayer.id },
        data: {
          isEliminated: true,
        },
      });

      // Move to next turn
      await this.moveToNextTurn(match);
    }
  }

  private async endMatch(match: MatchState, winner: any) {
    match.status = MatchStatus.FINISHED;

    const winnerMatchPlayer = match.players.find(p => p.playerId === winner.playerId);
    
    // Update database
    await this.prisma.match.update({
      where: { id: match.id },
      data: {
        status: MatchStatus.FINISHED,
        winnerId: winner.playerId,
        endedAt: new Date(),
      },
    });

    // Award points
    const placements = match.players
      .filter(p => !p.isEliminated)
      .sort((a, b) => {
        // Sort by placement (winner first, then by words submitted)
        if (a.playerId === winner.playerId) return -1;
        if (b.playerId === winner.playerId) return 1;
        return 0;
      });

    // Award placement points
    for (let i = 0; i < placements.length; i++) {
      const player = placements[i];
      let points = 0;

      if (i === 0) points = 50; // Winner
      else if (i === 1) points = 25; // Second
      else if (i === 2) points = 15; // Third
      else points = 5; // Participation

      await this.awardPoints(player.playerId, points);

      await this.prisma.matchPlayer.update({
        where: { id: player.id },
        data: {
          placement: i + 1,
          pointsEarned: points,
        },
      });
    }

    // Update lobby status
    await this.updateLobbyStatus(match.lobbyId, LobbyStatus.FINISHED);

    // Clean up timer
    const timer = this.turnTimers.get(match.id);
    if (timer) {
      clearTimeout(timer);
      this.turnTimers.delete(match.id);
    }
  }

  private async awardPoints(playerId: string, points: number) {
    await this.prisma.player.update({
      where: { id: playerId },
      data: {
        totalPoints: { increment: points },
      },
    });
  }

  private async updateLobbyStatus(lobbyId: string, status: LobbyStatus) {
    await this.prisma.lobby.update({
      where: { id: lobbyId },
      data: { status },
    });
  }

  calculateTimerForRound(round: number): number {
    const timer = 10 - (round - 1);
    return Math.max(3, timer);
  }

  async cleanupMatch(matchId: string) {
    const timer = this.turnTimers.get(matchId);
    if (timer) {
      clearTimeout(timer);
      this.turnTimers.delete(matchId);
    }
    this.activeMatches.delete(matchId);
  }

  async getActiveMatch(lobbyId: string): Promise<MatchState | null> {
    const match = await this.prisma.match.findFirst({
      where: {
        lobbyId,
        status: MatchStatus.IN_PROGRESS,
      },
    });

    if (!match) {
      return null;
    }

    return this.activeMatches.get(match.id) || null;
  }
}
