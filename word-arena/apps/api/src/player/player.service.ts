import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlayerDto, UpdatePlayerDto } from './dto/create-player.dto';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async create(createPlayerDto: CreatePlayerDto) {
    // Check for duplicate display names and add suffix if needed
    let displayName = createPlayerDto.displayName;
    let counter = 1;
    let existingPlayer = await this.prisma.player.findFirst({
      where: { displayName },
    });

    while (existingPlayer) {
      displayName = `${createPlayerDto.displayName}#${counter}`;
      counter++;
      existingPlayer = await this.prisma.player.findFirst({
        where: { displayName },
      });
    }

    const player = await this.prisma.player.create({
      data: {
        displayName,
        avatarId: createPlayerDto.avatarId,
        guestId: createPlayerDto.guestId,
      },
      include: {
        avatar: true,
      },
    });

    return player;
  }

  async findAll() {
    return this.prisma.player.findMany({
      include: {
        avatar: true,
      },
      orderBy: {
        totalPoints: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: {
        avatar: true,
        matches: {
          include: {
            match: {
              include: {
                usedWords: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return player;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.prisma.player.update({
      where: { id },
      data: updatePlayerDto,
      include: {
        avatar: true,
      },
    });

    return player;
  }

  async getLeaderboard(limit: number = 50) {
    const players = await this.prisma.player.findMany({
      include: {
        avatar: true,
      },
      orderBy: {
        totalPoints: 'desc',
      },
      take: limit,
    });

    return players.map((player, index) => ({
      rank: index + 1,
      id: player.id,
      displayName: player.displayName,
      avatar: player.avatar,
      points: player.totalPoints,
      wins: player.gamesWon,
      gamesPlayed: player.gamesPlayed,
      winRate: player.gamesPlayed > 0 
        ? ((player.gamesWon / player.gamesPlayed) * 100).toFixed(2) 
        : '0.00',
    }));
  }

  async getPlayerStats(playerId: string) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
      include: {
        avatar: true,
      },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    const matchHistory = await this.prisma.matchPlayer.findMany({
      where: { playerId },
      include: {
        match: {
          include: {
            lobby: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
      take: 20,
    });

    return {
      player,
      matchHistory,
    };
  }

  async remove(id: string) {
    await this.prisma.player.delete({
      where: { id },
    });
    return { success: true };
  }

  async getAvatars() {
    return this.prisma.avatar.findMany({
      orderBy: {
        category: 'asc',
      },
    });
  }
}
