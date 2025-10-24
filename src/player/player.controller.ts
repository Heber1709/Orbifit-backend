import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlayerService } from './player.service';

@Controller('player')
@UseGuards(AuthGuard('jwt'))
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('trainings')
  async getPlayerTrainings(@Req() req) {
    console.log('🎯 GET /player/trainings - Jugador ID:', req.user?.userId);
    return await this.playerService.getPlayerTrainings(req.user?.userId);
  }

  @Get('stats')
  async getPlayerStats(@Req() req) {
    console.log('📊 GET /player/stats - Jugador ID:', req.user?.userId);
    return await this.playerService.getPlayerStats(req.user?.userId);
  }

  @Get('performance')
  async getPlayerPerformance(@Req() req) {
    console.log('📈 GET /player/performance - Jugador ID:', req.user?.userId);
    return await this.playerService.getPlayerPerformance(req.user?.userId);
  }

  // Endpoint de DEBUG temporal
  @Get('debug')
  async debugEndpoint(@Req() req) {
    console.log('🐛 DEBUG /player/debug - Jugador ID:', req.user?.userId);
    
    // Verificar si el usuario existe
    const user = await this.playerService['prisma'].user.findUnique({
      where: { id: req.user?.userId }
    });

    // Verificar todos los entrenamientos
    const allTrainings = await this.playerService['prisma'].training.findMany({
      include: {
        participants: {
          include: {
            player: true
          }
        },
        coach: true
      }
    });

    // Verificar entrenamientos del jugador
    const playerTrainings = await this.playerService['prisma'].training.findMany({
      where: {
        participants: {
          some: {
            playerId: req.user?.userId
          }
        }
      },
      include: {
        participants: {
          include: {
            player: true
          }
        },
        coach: true
      }
    });

    return {
      message: 'Debug endpoint funcionando',
      user: user ? `${user.firstName} ${user.lastName} (${user.role})` : 'Usuario no encontrado',
      userId: req.user?.userId,
      allTrainingsCount: allTrainings.length,
      playerTrainingsCount: playerTrainings.length,
      allTrainings: allTrainings.map(t => ({
        id: t.id,
        title: t.title,
        date: t.date,
        participants: t.participants.map(p => `${p.player.firstName} ${p.player.lastName}`)
      })),
      playerTrainings: playerTrainings.map(t => ({
        id: t.id,
        title: t.title,
        date: t.date,
        participants: t.participants.map(p => `${p.player.firstName} ${p.player.lastName}`)
      }))
    };
  }
}