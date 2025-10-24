import { Controller, Get, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    const { password, ...result } = user;
    return result;
  }

  @Put('profile')
  updateProfile(@Request() req, @Body() updateData: any) {
    return this.usersService.updateProfile(req.user.userId, updateData);
  }

  @Get('coaches')
  getCoaches() {
    return this.usersService.getCoaches();
  }

  @Get('players')
  getPlayers() {
    return this.usersService.getPlayers();
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR)
  getAllUsers() {
    return this.usersService.findAll();
  }
}