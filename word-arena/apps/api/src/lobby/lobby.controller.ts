import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { CreateLobbyDto } from './dto/create-lobby.dto';

@Controller('lobbies')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {}

  @Post()
  create(@Body() createLobbyDto: CreateLobbyDto) {
    return this.lobbyService.create(createLobbyDto);
  }

  @Get()
  findAll() {
    return this.lobbyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lobbyService.findOne(id);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.lobbyService.findByCode(code);
  }

  @Post(':id/join')
  joinPlayer(
    @Param('id') id: string,
    @Body() body: { playerId: string },
  ) {
    return this.lobbyService.joinPlayer(id, body.playerId);
  }

  @Post(':id/leave')
  leavePlayer(
    @Param('id') id: string,
    @Body() body: { playerId: string },
  ) {
    return this.lobbyService.leavePlayer(id, body.playerId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lobbyService.remove(id);
  }
}
