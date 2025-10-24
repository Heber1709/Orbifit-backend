import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { CoachModule } from './coach/coach.module';
import { ChatModule } from './chat/chat.module';
import { PlayerModule } from './player/player.module';
import { AdminModule } from './admin/admin.module'; 
import { TournamentModule } from './tournament/tournament.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoachModule,
    ChatModule,
    PlayerModule,
    AdminModule, 
    TournamentModule,
  ],
})
export class AppModule {}