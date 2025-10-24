import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
@UseGuards(AuthGuard('jwt'))
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  async getAllTournaments(@Req() req) {
    console.log('🏆 GET /tournaments - User ID:', req.user?.userId);
    return this.tournamentService.getAllTournaments();
  }

  @Post()
  async createTournament(@Req() req, @Body() tournamentData: any) {
    console.log('✅ POST /tournaments - User ID:', req.user?.userId);
    console.log('📝 Datos torneo:', tournamentData);
    
    if (req.user?.role !== 'ADMINISTRADOR' && req.user?.role !== 'ENTRENADOR') {
      throw new Error('No autorizado');
    }
    
    return this.tournamentService.createTournament(tournamentData);
  }

  @Put(':id')
  async updateTournament(
    @Req() req,
    @Param('id', ParseIntPipe) tournamentId: number,
    @Body() tournamentData: any
  ) {
    console.log('🔄 PUT /tournaments/:id - ID:', tournamentId);
    console.log('📝 Datos:', tournamentData);
    
    if (req.user?.role !== 'ADMINISTRADOR' && req.user?.role !== 'ENTRENADOR') {
      throw new Error('No autorizado');
    }
    
    return this.tournamentService.updateTournament(tournamentId, tournamentData);
  }

  @Delete(':id')
  async deleteTournament(
    @Req() req,
    @Param('id', ParseIntPipe) tournamentId: number
  ) {
    console.log('🗑️ DELETE /tournaments/:id - ID:', tournamentId);
    
    if (req.user?.role !== 'ADMINISTRADOR') {
      throw new Error('No autorizado');
    }
    
    return this.tournamentService.deleteTournament(tournamentId);
  }

  @Get('stats')
  async getTournamentStats(@Req() req) {
    console.log('📊 GET /tournaments/stats - User ID:', req.user?.userId);
    return this.tournamentService.getTournamentStats();
  }
}