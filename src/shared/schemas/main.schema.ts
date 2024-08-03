import { z } from "zod";
import { userSchema } from "./auth.schema";

export const categorySchema = z.object({
  id: z.number().optional(),
  title: z.string(),
});

const idSchema = z.number().int().positive();
const dateSchema = z.date();
const optionalDateSchema = z.date().optional();

// Object schema
const objectSchema = z.object({
  id: idSchema,
  name: z.string(),
  categoryId: idSchema,
  description: z.string(),
  ownerId: idSchema,
  photos: z.array(z.string()),
  deletedAt: optionalDateSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// Post schema
const postSchema = z.object({
  id: idSchema,
  authorId: idSchema,
  deletedAt: optionalDateSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// ObjectPost schema
const objectPostSchema = z.object({
  id: idSchema,
  objectId: idSchema,
  postId: idSchema,
  deletedAt: optionalDateSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export type Category = z.infer<typeof categorySchema>;
export type Object = z.infer<typeof objectSchema>;
export type Post = z.infer<typeof postSchema>;
