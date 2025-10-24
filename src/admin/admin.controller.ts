import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getSystemStats(@Req() req) {
    console.log('📊 GET /admin/stats - Admin ID:', req.user?.userId);
    
    if (req.user?.role !== 'ADMINISTRADOR') {
      throw new Error('No autorizado');
    }
    
    return this.adminService.getSystemStats();
  }

  @Get('users')
  async getAllUsers(@Req() req) {
    console.log('👥 GET /admin/users - Admin ID:', req.user?.userId);
    
    if (req.user?.role !== 'ADMINISTRADOR') {
      throw new Error('No autorizado');
    }
    
    return this.adminService.getAllUsers();
  }

  @Post('users')
  async createUser(@Req() req, @Body() userData: any) {
    console.log('✅ POST /admin/users - Admin ID:', req.user?.userId);
    console.log('📝 Datos usuario:', userData);
    
    if (req.user?.role !== 'ADMINISTRADOR') {
      throw new Error('No autorizado');
    }
    
    return this.adminService.createUser(userData);
  }

  @Put('users/:id')
  async updateUser(
    @Req() req,
    @Param('id', ParseIntPipe) userId: number,
    @Body() userData: any
  ) {
    console.log('🔄 PUT /admin/users/:id - ID:', userId);
    console.log('📝 Datos:', userData);
    
    if (req.user?.role !== 'ADMINISTRADOR') {
      throw new Error('No autorizado');
    }
    
    return this.adminService.updateUser(userId, userData);
  }

  @Delete('users/:id')
  async deleteUser(
    @Req() req,
    @Param('id', ParseIntPipe) userId: number
  ) {
    console.log('🗑️ DELETE /admin/users/:id - ID:', userId);
    
    if (req.user?.role !== 'ADMINISTRADOR') {
      throw new Error('No autorizado');
    }
    
    return this.adminService.deleteUser(userId);
  }

  @Get('reports')
  async generateReports(@Req() req) {
    console.log('📈 GET /admin/reports - Admin ID:', req.user?.userId);
    
    if (req.user?.role !== 'ADMINISTRADOR') {
      throw new Error('No autorizado');
    }
    
    return this.adminService.generateReports();
  }
}