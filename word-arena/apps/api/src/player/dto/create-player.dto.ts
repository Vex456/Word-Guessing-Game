import { z } from 'zod';

export const CreatePlayerDtoSchema = z.object({
  displayName: z.string().min(1).max(20),
  avatarId: z.string().uuid(),
  guestId: z.string().optional(),
});

export type CreatePlayerDto = z.infer<typeof CreatePlayerDtoSchema>;

export const UpdatePlayerDtoSchema = z.object({
  displayName: z.string().min(1).max(20).optional(),
  avatarId: z.string().uuid().optional(),
});

export type UpdatePlayerDto = z.infer<typeof UpdatePlayerDtoSchema>;
