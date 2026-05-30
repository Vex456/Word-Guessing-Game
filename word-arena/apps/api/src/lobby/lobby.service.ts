import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { LobbyStatus } from '@prisma/client';

@Injectable()
export class LobbyService {
  constructor(private prisma: PrismaService) {}

  private generateLobbyCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async create(createLobbyDto: CreateLobbyDto) {
    let code = this.generateLobbyCode();
    
    // Ensure unique code
    let existing = await this.prisma.lobby.findUnique({ where: { code } });
    while (existing) {
      code = this.generateLobbyCode();
      existing = await this.prisma.lobby.findUnique({ where: { code } });
    }

    const lobby = await this.prisma.lobby.create({
      data: {
        code,
        hostId: createLobbyDto.hostId,
        minPlayers: createLobbyDto.minPlayers || 2,
        maxPlayers: createLobbyDto.maxPlayers || 5,
        status: LobbyStatus.WAITING,
      },
      include: {
        host: {
          include: {
            Avatar: true,
          },
        },
        players: {
          include: {
            Avatar: true,
          },
        },
      },
    });

    return lobby;
  }

  async findAll() {
    return this.prisma.lobby.findMany({
      where: {
        status: LobbyStatus.WAITING,
      },
      include: {
        host: {
          include: {
            Avatar: true,
          },
        },
        players: {
          include: {
            Avatar: true,
          },
        },
        _count: {
          select: {
            players: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const lobby = await this.prisma.lobby.findUnique({
      where: { id },
      include: {
        host: {
          include: {
            Avatar: true,
          },
        },
        players: {
          include: {
            Avatar: true,
          },
        },
        match: {
          include: {
            players: {
              include: {
                player: {
                  include: {
                    Avatar: true,
                  },
                },
              },
            },
            usedWords: true,
          },
        },
      },
    });

    if (!lobby) {
      throw new NotFoundException(`Lobby with ID ${id} not found`);
    }

    return lobby;
  }

  async findByCode(code: string) {
    const lobby = await this.prisma.lobby.findUnique({
      where: { code },
      include: {
        host: {
          include: {
            Avatar: true,
          },
        },
        players: {
          include: {
            Avatar: true,
          },
        },
      },
    });

    if (!lobby) {
      throw new NotFoundException(`Lobby with code ${code} not found`);
    }

    return lobby;
  }

  async joinPlayer(lobbyId: string, playerId: string) {
    const lobby = await this.prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: {
        players: true,
      },
    });

    if (!lobby) {
      throw new NotFoundException('Lobby not found');
    }

    if (lobby.status !== LobbyStatus.WAITING) {
      throw new BadRequestException('Lobby is not accepting players');
    }

    if (lobby.players.length >= lobby.maxPlayers) {
      throw new BadRequestException('Lobby is full');
    }

    // Check if player is already in lobby
    if (lobby.players.some(p => p.id === playerId)) {
      throw new BadRequestException('Player already in lobby');
    }

    const updatedLobby = await this.prisma.lobby.update({
      where: { id: lobbyId },
      data: {
        players: {
          connect: { id: playerId },
        },
      },
      include: {
        host: {
          include: {
            Avatar: true,
          },
        },
        players: {
          include: {
            Avatar: true,
          },
        },
      },
    });

    return updatedLobby;
  }

  async leavePlayer(lobbyId: string, playerId: string) {
    const lobby = await this.prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: {
        players: true,
      },
    });

    if (!lobby) {
      throw new NotFoundException('Lobby not found');
    }

    // If host leaves, delete the lobby or transfer host
    if (lobby.hostId === playerId) {
      // Delete lobby if host leaves
      await this.prisma.lobby.delete({
        where: { id: lobbyId },
      });
      return null;
    }

    const updatedLobby = await this.prisma.lobby.update({
      where: { id: lobbyId },
      data: {
        players: {
          disconnect: { id: playerId },
        },
      },
      include: {
        host: {
          include: {
            Avatar: true,
          },
        },
        players: {
          include: {
            Avatar: true,
          },
        },
      },
    });

    return updatedLobby;
  }

  async updateStatus(lobbyId: string, status: LobbyStatus) {
    return this.prisma.lobby.update({
      where: { id: lobbyId },
      data: { status },
      include: {
        host: {
          include: {
            Avatar: true,
          },
        },
        players: {
          include: {
            Avatar: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.prisma.lobby.delete({
      where: { id },
    });
    return { success: true };
  }

  async getLobbyState(lobbyId: string) {
    const lobby = await this.prisma.lobby.findUnique({
      where: { id: lobbyId },
      include: {
        host: {
          include: {
            Avatar: true,
          },
        },
        players: {
          include: {
            Avatar: true,
          },
        },
        match: {
          include: {
            players: {
              include: {
                player: {
                  include: {
                    Avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!lobby) {
      throw new NotFoundException(`Lobby with ID ${lobbyId} not found`);
    }

    return lobby;
  }

  async setPlayerReady(lobbyId: string, playerId: string, isReady: boolean) {
    await this.prisma.player.update({
      where: { id: playerId },
      data: { isReady },
    });

    return this.getLobbyState(lobbyId);
  }

  async addPlayerToLobby(lobbyId: string, playerId: string) {
    return this.joinPlayer(lobbyId, playerId);
  }

  async removePlayerFromLobby(lobbyId: string, playerId: string) {
    return this.leavePlayer(lobbyId, playerId);
  }

  async createLobby() {
    return this.create({ hostId: 'system', minPlayers: 2, maxPlayers: 5 });
  }
}
