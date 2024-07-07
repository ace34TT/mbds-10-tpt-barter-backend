import { Request, Response } from "express";
import {
  continueChatService,
  createChatService,
  deleteChatByIdService,
  getChatByUserService,
} from "../services/chat.services";
import { chatSchema, messageSchema } from "../shared/schemas/chst.schema";
import { z } from "zod";

export const createChatHandler = async (req: Request, res: Response) => {
  try {
    chatSchema.parse(req.body);
    const chat = await createChatService({
      ...req.body,
    });
    return res.status(200).json({
      message: "Chats get is working",
      chat,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
  }
};
export const continueChatHandler = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    const message = req.body;
    messageSchema.parse(message);
    if (!chatId || !message) {
      return res.status(400).json({ message: "Invalid chat id or message" });
    }
    const updatedChat = await continueChatService(chatId, message);
    return res
      .status(200)
      .json({ message: "Chat updated successfully", chat: updatedChat });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
      if (error.message.includes("not found")) {
        res.status(404).json({ message: error.message });
      } else {
        res
          .status(500)
          .json({ message: "An error occurred while updating the chat" });
      }
    }
  }
};
export const deleteChatHandler = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    if (!chatId) {
      return res.status(400).json({ message: "Invalid chat id" });
    }
    const deletedChat = deleteChatByIdService(chatId);
    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error: any) {
    if (error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while deleting the chat" });
    }
  }
};
export const getChatByIdHandler = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    if (!chatId) {
      return res.status(400).json({ message: "Invalid chat id" });
    }
    const chat = await getChatByUserService(chatId);
    return res.status(200).json(chat);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while getting the chat" });
    }
  }
};
export const getChatsByUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const chats = await getChatByUserService(userId);
    return res.status(200).json(chats);
  } catch (error: any) {
    if (error.message.includes("not found")) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "An error occurred while getting the chats" });
    }
  }
};
