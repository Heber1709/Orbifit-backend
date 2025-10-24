import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TournamentService {
  constructor(private prisma: PrismaService) {}

  async getAllTournaments() {
    try {
      const tournaments = await this.prisma.tournament.findMany({
        orderBy: {
          startDate: 'asc'
        }
      });

      return tournaments;
    } catch (error) {
      console.error('Error getting tournaments:', error);
      throw new Error('Error al obtener torneos');
    }
  }

  async createTournament(tournamentData: any) {
    try {
      const { name, description, startDate, endDate, teamsCount } = tournamentData;

      const tournament = await this.prisma.tournament.create({
        data: {
          name,
          description,
          startDate: new Date(startDate),
          endDate: endDate ? new Date(endDate) : null,
          teamsCount: teamsCount || 0,
          status: 'ACTIVO'
        }
      });

      return tournament;
    } catch (error) {
      console.error('Error creating tournament:', error);
      throw new Error('Error al crear torneo: ' + error.message);
    }
  }

  async updateTournament(tournamentId: number, tournamentData: any) {
    try {
      const updatedTournament = await this.prisma.tournament.update({
        where: { id: tournamentId },
        data: {
          ...tournamentData,
          startDate: tournamentData.startDate ? new Date(tournamentData.startDate) : undefined,
          endDate: tournamentData.endDate ? new Date(tournamentData.endDate) : undefined,
        }
      });

      return updatedTournament;
    } catch (error) {
      console.error('Error updating tournament:', error);
      throw new Error('Error al actualizar torneo: ' + error.message);
    }
  }

  async deleteTournament(tournamentId: number) {
    try {
      await this.prisma.tournament.delete({
        where: { id: tournamentId }
      });

      return { 
        success: true,
        message: 'Torneo eliminado correctamente'
      };
    } catch (error) {
      console.error('Error deleting tournament:', error);
      throw new Error('Error al eliminar torneo: ' + error.message);
    }
  }

  async getTournamentStats() {
    try {
      const totalTournaments = await this.prisma.tournament.count();
      const activeTournaments = await this.prisma.tournament.count({
        where: { status: 'ACTIVO' }
      });
      const scheduledTournaments = await this.prisma.tournament.count({
        where: { status: 'PROGRAMADO' }
      });
      const finishedTournaments = await this.prisma.tournament.count({
        where: { status: 'FINALIZADO' }
      });

      return {
        totalTournaments,
        activeTournaments,
        scheduledTournaments,
        finishedTournaments
      };
    } catch (error) {
      console.error('Error getting tournament stats:', error);
      throw new Error('Error al obtener estadísticas de torneos');
    }
  }
}