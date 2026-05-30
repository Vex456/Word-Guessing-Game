import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageType } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async sendPublicMessage(lobbyId: string, senderId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        lobbyId,
        senderId,
        content,
        messageType: MessageType.PUBLIC,
      },
      include: {
        sender: {
          include: {
            avatar: true,
          },
        },
      },
    });

    return message;
  }

  async sendPrivateMessage(senderId: string, receiverId: string, content: string) {
    const message = await this.prisma.privateMessage.create({
      data: {
        senderId,
        receiverId,
        content,
      },
      include: {
        sender: {
          include: {
            avatar: true,
          },
        },
        receiver: {
          include: {
            avatar: true,
          },
        },
      },
    });

    return message;
  }

  async sendMessage(data: { 
    senderId: string; 
    content: string; 
    lobbyId?: string; 
    receiverId?: string; 
    messageType?: 'PUBLIC' | 'PRIVATE' | 'SYSTEM' 
  }) {
    if (data.receiverId) {
      return this.sendPrivateMessage(data.senderId, data.receiverId, data.content);
    } else if (data.lobbyId) {
      return this.sendPublicMessage(data.lobbyId, data.senderId, data.content);
    }
    throw new Error('Either lobbyId or receiverId must be provided');
  }

  async getLobbyMessages(lobbyId: string, limit: number = 50) {
    return this.prisma.message.findMany({
      where: { lobbyId },
      include: {
        sender: {
          include: {
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getPrivateMessages(userId1: string, userId2: string, limit: number = 50) {
    const messages = await this.prisma.privateMessage.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      include: {
        sender: {
          include: {
            avatar: true,
          },
        },
        receiver: {
          include: {
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return messages.reverse(); // Return in chronological order
  }

  async markPrivateMessagesAsRead(receiverId: string, senderId: string) {
    await this.prisma.privateMessage.updateMany({
      where: {
        receiverId,
        senderId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getUnreadPrivateMessagesCount(userId: string) {
    const count = await this.prisma.privateMessage.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    return count;
  }
}
