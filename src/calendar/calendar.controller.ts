import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CalendarService } from './calendar.service';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Get('events')
  getEvents(@Query('year') year: string, @Query('month') month: string) {
    return this.calendarService.getEvents(parseInt(year), parseInt(month));
  }

  @Get('events/date')
  getEventsByDate(@Query('date') date: string) {
    return this.calendarService.getEventsByDate(date);
  }

  @Post('events')
  createEvent(@Body() eventData: any, @Request() req) {
    return this.calendarService.createEvent({
      ...eventData,
      createdById: req.user.userId,
    });
  }
}