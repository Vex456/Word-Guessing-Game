import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { MatchModule } from '../match/match.module';
import { LobbyModule } from '../lobby/lobby.module';
import { ChatModule } from '../chat/chat.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [MatchModule, LobbyModule, ChatModule, PlayerModule],
  providers: [GameGateway],
  exports: [GameGateway],
})
export class GatewayModule {}
