import * as z from "zod";
import { postSchema } from "./main.schema";
import { userSchema } from "./auth.schema";
const objectSuggestionSchema = z.object({
  id: z.number().int().positive(),
  objectId: z.number().int().positive(),
  suggestionId: z.number().int().positive(),
  deletedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const suggestionSchema = z.object({
  id: z.number().int().positive().optional(),
  status: z.enum(["PENDING", "ACCEPTED", "DECLINED"]).default("PENDING"),
  postId: z.number().int().positive(),
  post: postSchema.optional(),
  suggestedObjectIds: z.array(z.number().int().positive()),
  suggestedObject: objectSuggestionSchema.optional(),
  suggestedBy: userSchema.optional(),
  suggestedById: z.number().int().positive(),
  deletedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Suggestion = z.infer<typeof suggestionSchema>;
export type ObjectSuggestion = z.infer<typeof objectSuggestionSchema>;
