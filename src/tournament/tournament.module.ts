import { Module } from '@nestjs/common';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [TournamentController],
  providers: [TournamentService, PrismaService],
  exports: [TournamentService],
})
export class TournamentModule {}