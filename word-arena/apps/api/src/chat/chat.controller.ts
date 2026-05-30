import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('public')
  sendPublicMessage(
    @Body() body: { lobbyId: string; senderId: string; content: string },
  ) {
    return this.chatService.sendPublicMessage(
      body.lobbyId,
      body.senderId,
      body.content,
    );
  }

  @Post('private')
  sendPrivateMessage(
    @Body()
    body: { senderId: string; receiverId: string; content: string },
  ) {
    return this.chatService.sendPrivateMessage(
      body.senderId,
      body.receiverId,
      body.content,
    );
  }

  @Get('lobby/:lobbyId')
  getLobbyMessages(
    @Param('lobbyId') lobbyId: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getLobbyMessages(
      lobbyId,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('private/:userId1/:userId2')
  getPrivateMessages(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getPrivateMessages(
      userId1,
      userId2,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Post('private/read')
  markAsRead(
    @Body() body: { receiverId: string; senderId: string },
  ) {
    return this.chatService.markPrivateMessagesAsRead(
      body.receiverId,
      body.senderId,
    );
  }

  @Get('private/unread/:userId')
  getUnreadCount(@Param('userId') userId: string) {
    return this.chatService.getUnreadPrivateMessagesCount(userId);
  }
}
