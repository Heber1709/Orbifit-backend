import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSystemStats() {
    try {
      const totalUsers = await this.prisma.user.count();
      const totalPlayers = await this.prisma.user.count({
        where: { 
          role: 'JUGADOR'
        }
      });
      const totalCoaches = await this.prisma.user.count({
        where: { 
          role: 'ENTRENADOR'
        }
      });
      const totalAdmins = await this.prisma.user.count({
        where: { 
          role: 'ADMINISTRADOR'
        }
      });
      const activeTrainings = await this.prisma.training.count({
        where: { 
          date: { gte: new Date() }
        }
      });
      const totalTournaments = 0;

      return {
        totalUsers,
        totalPlayers,
        totalCoaches,
        totalAdmins,
        activeTrainings,
        totalTournaments
      };
    } catch (error) {
      console.error('Error getting system stats:', error);
      throw new Error('Error al obtener estadísticas del sistema');
    }
  }

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          position: true,
          isActive: true,
          createdAt: true,
          username: true,
          phone: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return users.map(user => ({
        ...user,
        role: this.mapRoleToSpanish(user.role),
        status: user.isActive ? 'active' : 'inactive'
      }));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw new Error('Error al obtener usuarios');
    }
  }

  async createUser(userData: any) {
    try {
      const { firstName, lastName, email, role, password, username, phone } = userData;
      
      const existingUser = await this.prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new Error('El usuario ya existe');
      }

      const finalUsername = username || email.split('@')[0];
      const finalRole = this.mapRoleToEnglish(role);
      const hashedPassword = await bcrypt.hash(password, 10);

      const userDataForCreate: any = {
        username: finalUsername,
        email,
        firstName,
        lastName,
        role: finalRole,
        password: hashedPassword,
        isActive: true,
        phone: phone || null
      };

      if (finalRole === 'JUGADOR') {
        userDataForCreate.position = 'MEDIOCAMPO';
        userDataForCreate.age = 20;
        userDataForCreate.jerseyNumber = 99;
      } else if (finalRole === 'ENTRENADOR') {
        userDataForCreate.specialization = 'General';
        userDataForCreate.experienceYears = 1;
        userDataForCreate.license = 'Nacional';
      }

      const user = await this.prisma.user.create({
        data: userDataForCreate,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          username: true,
          phone: true
        }
      });

      return {
        ...user,
        role: this.mapRoleToSpanish(user.role),
        status: 'active'
      };

    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error al crear usuario: ' + error.message);
    }
  }

  async updateUser(userId: number, userData: any) {
    try {
      if (userData.role) {
        userData.role = this.mapRoleToEnglish(userData.role);
      }

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: userData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          username: true,
          phone: true,
          position: true
        }
      });

      return {
        ...updatedUser,
        role: this.mapRoleToSpanish(updatedUser.role),
        status: updatedUser.isActive ? 'active' : 'inactive'
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error al actualizar usuario: ' + error.message);
    }
  }

  async deleteUser(userId: number) {
    try {
      console.log('🔄 Desactivando usuario ID:', userId);
      
      // SOLO ACTUALIZAR - NO ELIMINAR
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { 
          isActive: false,
          email: `deleted_${Date.now()}_${userId}@deleted.com`,
          username: `deleted_${Date.now()}_${userId}`
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          username: true,
          phone: true
        }
      });

      console.log('✅ Usuario desactivado:', updatedUser);

      return {
        ...updatedUser,
        role: this.mapRoleToSpanish(updatedUser.role),
        status: 'inactive',
        message: 'Usuario desactivado correctamente. Ya no podrá acceder al sistema.'
      };
    } catch (error) {
      console.error('❌ Error desactivando usuario:', error);
      
      // Si hay error de foreign key, igual podemos desactivar
      if (error.code === 'P2003' || error.code === 'P2014') {
        console.log('⚠️ Usuario tiene datos relacionados, intentando solo desactivar...');
        
        try {
          const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { 
              isActive: false
            },
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              isActive: true,
              createdAt: true,
              username: true,
              phone: true
            }
          });

          return {
            ...updatedUser,
            role: this.mapRoleToSpanish(updatedUser.role),
            status: 'inactive',
            message: 'Usuario desactivado correctamente (se mantuvo el email por datos relacionados).'
          };
        } catch (secondError) {
          console.error('❌ Error en segundo intento:', secondError);
          throw new Error('Error al desactivar usuario: ' + secondError.message);
        }
      }
      
      throw new Error('Error al desactivar usuario: ' + error.message);
    }
  }

  async generateReports() {
    try {
      console.log('📊 Generando reportes del sistema...');
      
      // Estadísticas de usuarios
      const usersByRole = await this.prisma.user.groupBy({
        by: ['role'],
        _count: {
          id: true
        },
        where: {
          isActive: true
        }
      });

      const usersByStatus = await this.prisma.user.groupBy({
        by: ['isActive'],
        _count: {
          id: true
        }
      });

      // Estadísticas de entrenamientos
      const trainingsByType = await this.prisma.training.groupBy({
        by: ['type'],
        _count: {
          id: true
        }
      });

      const monthlyTrainings = await this.getMonthlyTrainings();

      // Estadísticas de torneos
      const tournamentStats = await this.prisma.tournament.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });

      // Usuarios nuevos este mes
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const newUsersThisMonth = await this.prisma.user.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      });

      // Entrenamientos activos
      const activeTrainings = await this.prisma.training.count({
        where: {
          date: {
            gte: new Date()
          }
        }
      });

      const reportData = {
        userStats: {
          byRole: usersByRole,
          byStatus: usersByStatus,
          newThisMonth: newUsersThisMonth,
          total: await this.prisma.user.count()
        },
        trainingStats: {
          byType: trainingsByType,
          monthly: monthlyTrainings,
          total: await this.prisma.training.count(),
          active: activeTrainings
        },
        tournamentStats: {
          byStatus: tournamentStats,
          total: await this.prisma.tournament.count()
        },
        systemStats: {
          generatedAt: new Date().toISOString(),
          storageUsed: await this.calculateStorageUsage(),
        },
        generatedAt: new Date().toLocaleString('es-ES')
      };

      console.log('✅ Reportes generados exitosamente');
      return reportData;
    } catch (error) {
      console.error('❌ Error generating reports:', error);
      throw new Error('Error al generar reportes');
    }
  }

  private async getMonthlyTrainings() {
    try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const trainings = await this.prisma.training.findMany({
        where: {
          date: {
            gte: sixMonthsAgo
          }
        },
        select: {
          date: true
        }
      });

      // Agrupar por mes
      const monthlyData = trainings.reduce((acc: any, training) => {
        const month = training.date.toISOString().substring(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      return monthlyData;
    } catch (error) {
      console.error('Error obteniendo entrenamientos mensuales:', error);
      return {};
    }
  }

  private async calculateStorageUsage() {
    try {
      // Estimación básica basada en registros en la BD
      const userCount = await this.prisma.user.count();
      const trainingCount = await this.prisma.training.count();
      const tournamentCount = await this.prisma.tournament.count();
      
      const estimatedSize = (userCount * 2 + trainingCount * 5 + tournamentCount * 10) / 1024;
      return `${estimatedSize.toFixed(2)} MB`;
    } catch (error) {
      console.error('Error calculando uso de almacenamiento:', error);
      return '0 MB';
    }
  }

  private mapRoleToSpanish(role: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMINISTRADOR': 'administrador',
      'ENTRENADOR': 'entrenador', 
      'JUGADOR': 'jugador'
    };
    return roleMap[role] || role.toLowerCase();
  }

  private mapRoleToEnglish(role: string): string {
    const roleMap: { [key: string]: string } = {
      'administrador': 'ADMINISTRADOR',
      'entrenador': 'ENTRENADOR',
      'jugador': 'JUGADOR'
    };
    return roleMap[role] || role.toUpperCase();
  }
}