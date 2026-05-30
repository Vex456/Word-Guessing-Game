import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DictionaryModule } from '../dictionary/dictionary.module';

@Module({
  imports: [PrismaModule, DictionaryModule],
  providers: [MatchService],
  exports: [MatchService],
})
export class MatchModule {}
