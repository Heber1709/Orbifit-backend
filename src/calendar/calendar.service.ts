import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EventType } from '@prisma/client';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getEvents(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    return this.prisma.event.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async createEvent(eventData: {
    title: string;
    description?: string;
    type: EventType;
    date: Date;
    time?: string;
    location?: string;
    createdById: number;
  }) {
    return this.prisma.event.create({
      data: eventData,
    });
  }

  async getEventsByDate(date: string) {
    const targetDate = new Date(date);
    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);

    return this.prisma.event.findMany({
      where: {
        date: {
          gte: targetDate,
          lt: nextDate,
        },
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}