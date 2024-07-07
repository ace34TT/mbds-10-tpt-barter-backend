import { z } from "zod";

export const messageSchema = z.object({
  author: z.string(),
  text: z.string(),
  timestamp: z.date().default(() => new Date()),
});

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
});

export const chatSchema = z.object({
  sender: userSchema,
  receiver: userSchema,
  messages: z.array(messageSchema),
});
