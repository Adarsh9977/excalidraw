import { z } from 'zod';

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(1),
    name: z.string().min(1),
});

export const SigninSchema = z.object({
    username: z.string().min(3).max(50),
    password: z.string().min(1),
});

export const CreateRoomSchema = z.object({
    roomName: z.string().min(3).max(20),
});
