import { z } from "zod";

const baseUserSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  roleId: z.number(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const roleSchema = z.object({
  id: z.number().optional(),
  title: z.string(),
  description: z.string(),
  Users: z.array(baseUserSchema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const userSchema = baseUserSchema.and(
  z.object({
    role: roleSchema.optional(),
  })
);

// generate a login schema
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const loginUserSchema = loginSchema.and(
  z.object({
    user: userSchema.optional(),
  })
);
export type LoginUser = z.infer<typeof loginUserSchema>;
export type Role = z.infer<typeof roleSchema>;
export type User = z.infer<typeof userSchema>;
