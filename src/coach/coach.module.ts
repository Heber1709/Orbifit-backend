import { Module } from '@nestjs/common';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [CoachController], // ← SOLO CoachController
  providers: [CoachService, PrismaService],
  exports: [CoachService],
})
export class CoachModule {}