import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('messages/general')
  async getGeneralMessages() {
    return await this.chatService.getGeneralMessages();
  }

  @Post('messages/send')
  async sendMessage(@Req() req, @Body() messageData: any) {
    const { content } = messageData;
    return await this.chatService.sendMessage(req.user.userId, content);
  }

  @Get('team-members')
  async getTeamMembers(@Req() req) {
    return await this.chatService.getTeamMembers(req.user.userId);
  }
}