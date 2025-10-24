import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(private prisma: PrismaService) {}

  async getPlayerTrainings(playerId: number) {
    this.logger.log(`🎯 Buscando entrenamientos para jugador ID: ${playerId}`);
    
    try {
      // Verificar que el jugador existe
      const player = await this.prisma.user.findUnique({
        where: { id: playerId }
      });

      if (!player) {
        this.logger.error(`❌ Jugador no encontrado con ID: ${playerId}`);
        return [];
      }

      this.logger.log(`👤 Jugador encontrado: ${player.firstName} ${player.lastName}`);

      const trainings = await this.prisma.training.findMany({
        where: {
          participants: {
            some: {
              playerId: playerId
            }
          }
        },
        include: {
          participants: {
            include: {
              player: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          coach: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: {
          date: 'asc'
        }
      });

      this.logger.log(`✅ Encontrados ${trainings.length} entrenamientos para el jugador`);

      // Log detallado de los entrenamientos encontrados
      trainings.forEach(training => {
        this.logger.log(`📅 Entrenamiento: ${training.title} - ${training.date} - Participantes: ${training.participants.length}`);
      });

      return trainings;

    } catch (error) {
      this.logger.error(`❌ Error buscando entrenamientos: ${error.message}`);
      return [];
    }
  }

  async getPlayerStats(playerId: number) {
  try {
    const trainingsCount = await this.prisma.training.count({
      where: {
        participants: {
          some: {
            playerId: playerId
          }
        }
      }
    });

    const completedTrainings = await this.prisma.training.count({
      where: {
        participants: {
          some: {
            playerId: playerId
          }
        },
        date: {
          lt: new Date() // Entrenamientos que ya pasaron
        }
      }
    });

    return {
      trainingsCompleted: completedTrainings,
      totalTrainings: trainingsCount,
      matchesPlayed: completedTrainings,
      goals: 0,
      assists: 0,
      nextMatch: 'Por programar'
    };
  } catch (error) {
    this.logger.error(`❌ Error obteniendo estadísticas: ${error.message}`);
    return {
      trainingsCompleted: 0,
      totalTrainings: 0,
      matchesPlayed: 0,
      goals: 0,
      assists: 0,
      nextMatch: 'Por programar'
    };
  }
}

  async getPlayerPerformance(playerId: number) {
    try {
      const results = await this.prisma.trainingResult.findMany({
        where: {
          playerId: playerId
        },
        include: {
          training: {
            select: {
              id: true,
              title: true,
              date: true
            }
          }
        },
        orderBy: {
          training: {
            date: 'desc'
          }
        }
      });

      if (results.length === 0) {
        return null;
      }

      let totalEndurance = 0;
      let totalTechnique = 0;
      let totalAttitude = 0;

      results.forEach(result => {
        totalEndurance += result.endurance || 3;
        totalTechnique += result.technique || 3;
        totalAttitude += result.attitude || 3;
      });

      const count = results.length;
      
      return {
        endurance: totalEndurance / count,
        technique: totalTechnique / count,
        attitude: totalAttitude / count,
        overall: (totalEndurance + totalTechnique + totalAttitude) / (3 * count),
        totalTrainings: count,
        lastTraining: results[0]?.training?.date
      };
    } catch (error) {
      this.logger.error(`❌ Error obteniendo rendimiento: ${error.message}`);
      return null;
    }
  }
}