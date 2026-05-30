import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PlayerModule } from './player/player.module';
import { LobbyModule } from './lobby/lobby.module';
import { MatchModule } from './match/match.module';
import { ChatModule } from './chat/chat.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    PrismaModule,
    PlayerModule,
    LobbyModule,
    MatchModule,
    ChatModule,
    DictionaryModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
