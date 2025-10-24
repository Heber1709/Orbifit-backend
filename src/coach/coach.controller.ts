import { Controller, Get, Post, Put, Delete, UseGuards, Req, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CoachService } from './coach.service';

@Controller('coach')
@UseGuards(AuthGuard('jwt'))
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Get('players')
  async getPlayers(@Req() req) {
    console.log('👥 GET /coach/players');
    return this.coachService.getPlayers(req.user?.userId);
  }

  @Get('stats')
  async getTeamStats(@Req() req) {
    console.log('📊 GET /coach/stats');
    return this.coachService.getTeamStats(req.user?.userId);
  }

  @Get('profile')
  async getCoachProfile(@Req() req) {
    console.log('👤 GET /coach/profile');
    return this.coachService.getCoachProfile(req.user?.userId);
  }

  @Get('trainings')
  async getCoachTrainings(@Req() req) {
    console.log('📅 GET /coach/trainings');
    return this.coachService.getCoachTrainings(req.user?.userId);
  }

  @Post('trainings')
  async createTraining(@Req() req, @Body() trainingData: any) {
    console.log('✅ POST /coach/trainings');
    const coachId = req.user?.userId;
    return this.coachService.createTraining(coachId, trainingData);
  }

  @Put('trainings/:id')
  async updateTraining(
    @Req() req,
    @Param('id', ParseIntPipe) trainingId: number,
    @Body() trainingData: any
  ) {
    console.log('🎯 PUT /coach/trainings/:id - ID:', trainingId);
    console.log('📝 Datos:', trainingData);
    
    const coachId = req.user?.userId;
    const result = await this.coachService.updateTraining(trainingId, trainingData, coachId);
    console.log('✅ UPDATE EXITOSO');
    return result;
  }

  @Delete('trainings/:id')
  async deleteTraining(
    @Req() req,
    @Param('id', ParseIntPipe) trainingId: number
  ) {
    console.log('🗑️ DELETE /coach/trainings/:id - ID:', trainingId);
    
    const coachId = req.user?.userId;
    const result = await this.coachService.deleteTraining(trainingId, coachId);
    console.log('✅ DELETE EXITOSO');
    return result;
  }

  @Post('training-results')
  async saveTrainingResults(@Req() req, @Body() resultsData: any) {
    console.log('📝 POST /coach/training-results');
    console.log('📊 Datos recibidos:', resultsData);
    
    const coachId = req.user?.userId;
    return this.coachService.saveTrainingResults(coachId, resultsData);
  }

  @Get('training-results/:trainingId')
  async getTrainingResults(
    @Req() req,
    @Param('trainingId', ParseIntPipe) trainingId: number
  ) {
    console.log('📋 GET /coach/training-results/:trainingId - ID:', trainingId);
    
    const coachId = req.user?.userId;
    return this.coachService.getTrainingResults(coachId, trainingId);
  }

  @Put('training-results/:trainingId')
  async updateTrainingResults(
    @Req() req,
    @Param('trainingId', ParseIntPipe) trainingId: number,
    @Body() resultsData: any
  ) {
    console.log('🔄 PUT /coach/training-results/:trainingId - ID:', trainingId);
    console.log('📝 Datos:', resultsData);
    
    const coachId = req.user?.userId;
    return this.coachService.saveTrainingResults(coachId, resultsData);
  }

  @Delete('training-results/:trainingId')
  async deleteTrainingResults(
    @Req() req,
    @Param('trainingId', ParseIntPipe) trainingId: number
  ) {
    console.log('🗑️ DELETE /coach/training-results/:trainingId - ID:', trainingId);
    
    const coachId = req.user?.userId;
    return this.coachService.deleteTrainingResults(coachId, trainingId);
  }

  @Get('training-results')
  async getAllTrainingResults(@Req() req) {
    console.log('📋 GET /coach/training-results - Todos los resultados');
    
    const coachId = req.user?.userId;
    return this.coachService.getAllTrainingResults(coachId);
  }
}