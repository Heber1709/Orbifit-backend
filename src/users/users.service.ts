import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, UserRole, PlayerPosition } from '@prisma/client';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<{
  id: number;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  position: PlayerPosition | null;
} | null> {
  return this.prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      password: true,
      role: true,
      position: true,
    },
  });

}

  async findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(userData: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    age?: number;
    position?: PlayerPosition;
    phone?: string;
    jerseyNumber?: number;
  }): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: userData.email },
          { username: userData.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('El usuario o email ya existe');
    }

    return this.prisma.user.create({
      data: userData,
    });
  }

  async findAll(role?: UserRole) {
    const where = role ? { role } : {};
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        age: true,
        position: true,
        phone: true,
        jerseyNumber: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(id: number, updateData: any) {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        age: true,
        position: true,
        phone: true,
        jerseyNumber: true,
        license: true,
        experienceYears: true,
        specialization: true,
      },
    });
  }

  async getCoaches() {
    return this.prisma.user.findMany({
      where: { role: 'ENTRENADOR' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        specialization: true,
        experienceYears: true,
      },
    });
  }

  async getPlayers() {
    return this.prisma.user.findMany({
      where: { role: 'JUGADOR' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        position: true,
        jerseyNumber: true,
        age: true,
      },
    });
  }

  // 🔐 MÉTODOS NUEVOS PARA RECUPERACIÓN DE CONTRASEÑA
  async updatePassword(userId: number, newPassword: string): Promise<User> {
    console.log(`🔄 Actualizando contraseña para usuario ID: ${userId}`);
    
    // ¡IMPORTANTE! Hashear la contraseña igual que en el registro
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    return this.prisma.user.update({
      where: { id: userId },
      data: { 
        password: hashedPassword,
        updatedAt: new Date()
      }
    });
  }

  async updatePasswordByEmail(email: string, newPassword: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    return this.updatePassword(user.id, newPassword);
  }

}