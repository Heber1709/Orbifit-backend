import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getGeneralMessages() {
    try {
      const messages = await this.prisma.message.findMany({
        where: {
          type: 'GENERAL',
          receiverId: null
        },
        orderBy: { createdAt: 'asc' },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          }
        },
      });
      return messages;
    } catch (error) {
      console.error('Error getting general messages:', error);
      return [];
    }
  }

  async sendMessage(senderId: number, content: string) {
    try {
      const message = await this.prisma.message.create({
        data: {
          content: content.trim(),
          senderId: senderId,
          type: 'GENERAL',
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          }
        },
      });
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Error al enviar el mensaje');
    }
  }

  async getTeamMembers(currentUserId: number) {
    try {
      const members = await this.prisma.user.findMany({
        where: {
          id: { not: currentUserId },
          isActive: true
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          position: true,
        },
        orderBy: {
          firstName: 'asc'
        }
      });
      return members;
    } catch (error) {
      console.error('Error getting team members:', error);
      return [];
    }
  }
}