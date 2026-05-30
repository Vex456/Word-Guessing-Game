import { z } from 'zod';

export const CreateLobbyDtoSchema = z.object({
  hostId: z.string().uuid(),
  code: z.string().optional(),
  minPlayers: z.number().min(2).max(5).optional(),
  maxPlayers: z.number().min(2).max(5).optional(),
});

export type CreateLobbyDto = z.infer<typeof CreateLobbyDtoSchema>;

export const JoinLobbyDtoSchema = z.object({
  playerId: z.string().uuid(),
  lobbyCode: z.string(),
});

export type JoinLobbyDto = z.infer<typeof JoinLobbyDtoSchema>;

export const LobbyActionDtoSchema = z.object({
  playerId: z.string().uuid(),
  action: z.enum(['ready', 'unready', 'leave']),
});

export type LobbyActionDto = z.infer<typeof LobbyActionDtoSchema>;
