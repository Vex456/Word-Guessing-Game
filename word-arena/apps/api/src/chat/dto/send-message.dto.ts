import { z } from 'zod';

export const SendMessageDtoSchema = z.object({
  lobbyId: z.string().uuid(),
  senderId: z.string().uuid(),
  content: z.string().min(1).max(500),
});

export type SendMessageDto = z.infer<typeof SendMessageDtoSchema>;

export const SendPrivateMessageDtoSchema = z.object({
  senderId: z.string().uuid(),
  receiverId: z.string().uuid(),
  content: z.string().min(1).max(500),
});

export type SendPrivateMessageDto = z.infer<typeof SendPrivateMessageDtoSchema>;
