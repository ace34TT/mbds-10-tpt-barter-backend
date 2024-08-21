import {Request, Response} from "express";
import {
  continueChatService,
  createChatService,
  deleteChatByIdService,
  findChatByParticipantsService, getChatByIdService,
  getChatByUserService,
  getChatByIdService
} from "../services/chat.services";
import {chatSchema, messageSchema} from "../shared/schemas/chat.schema";
import {z} from "zod";
import {IMessage} from "../shared/interfaces/mongoModels.interfaces";
import {socketManager} from "../configs/socket.configs";
import {Chat} from "../models/chats.models";

export const createChatHandler = async (req: Request, res: Response) => {
  try {
    const {sender, receiver, messages} = req.body;
    const convertedMessages = messages.map((message: IMessage) => ({
      ...message,
      timestamp: new Date(message.timestamp), // Convert string to Date object
    }));
    const _chat = {
      sender,
      receiver,
      messages: convertedMessages,
    };
    chatSchema.parse(_chat);
    const chat = await createChatService(_chat);
    return res.status(200).json({
      message: "Chats get is working",
      chat,
    });
  } catch (error : any) {
    console.log(error.message);
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
    message.timestamp = new Date(message.timestamp);
    messageSchema.parse(message);
    console.log(message);
    if (!chatId || !message) {
      return res.status(400).json({message: "Invalid chat id or message"});
    }
    const updatedChat = await continueChatService(chatId, message).exec();
    const chat = await Chat.findById(chatId).exec();
    // send realtime answer to the participants
    // Check if recipient is online using their database ID
    console.log(socketManager.getUsers())
    console.log("user" , message.author)
    const author : "sender" | "receiver" = message.author ==="sender" ? "receiver" : "sender";
    console.log(chat?.[author]!.id);
    const recipientSocketId = socketManager.getUsers().get(chat?.[author]!.id!.toString()!);
    // log reciprocation id
    console.log("recipient socket id is : ", recipientSocketId)
    if (recipientSocketId) {
      socketManager.getIo().to(recipientSocketId).emit('new-message', {
        chatId,
        message,
      });
      message.deliveryStatus = 'delivered';
    } else {
      message.deliveryStatus = 'sent'; // User is offline
    }
    return res
        .status(200)
        .json({message: "Chat updated successfully", chat: updatedChat});
  } catch (error: any) {
    console.log(error.message);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
      if (error.message.includes("not found")) {
        res.status(404).json({message: error.message});
      } else {
        res
            .status(500)
            .json({message: "An error occurred while updating the chat"});
      }
    }
  }
};


export const deleteChatHandler = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    if (!chatId) {
      return res.status(400).json({message: "Invalid chat id"});
    }
    const deletedChat = deleteChatByIdService(chatId);
    return res.status(200).json({message: "Chat deleted successfully"});
  } catch (error: any) {
    if (error.message.includes("not found")) {
      res.status(404).json({message: error.message});
    } else {
      res
          .status(500)
          .json({message: "An error occurred while deleting the chat"});
    }
  }
};
export const getChatByIdHandler = async (req: Request, res: Response) => {
  try {
    const chatId = req.params.id;
    console.log(chatId);
    if (!chatId) {
      return res.status(400).json({message: "Invalid chat id"});
    }
    const chat = await getChatByIdService(chatId);
    return res.status(200).json(chat);
  } catch (error: any) {
    console.log(error.message);
    if (error.message.includes("not found")) {
      res.status(404).json({message: error.message});
    } else {
      res
          .status(500)
          .json({message: "An error occurred while getting the chat"});
    }
  }
};
export const getChatsByUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({message: "Invalid user id"});
    }
    const chats = await getChatByUserService(userId);
    console.log(chats)
    return res.status(200).json(chats);
  } catch (error: any) {
    console.log(error);
    if (error.message.includes("not found")) {
      res.status(404).json({message: error.message});
    } else {
      res
          .status(500)
          .json({message: "An error occurred while getting the chats"});
    }
  }
};

export const getChatByParticipantsHandler = async (
    req: Request,
    res: Response
) => {
  try {
    const {senderId, receiverId} = req.params;
    if (!senderId || !receiverId)
      return res
          .status(400)
          .json({message: "senderId and receiverId are required"});
    const chat = await findChatByParticipantsService(senderId, receiverId);
    if (!chat)
      return res.status(400).json({
        message: `chat with participant : ${senderId} and ${receiverId} not found`,
      });
    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json(error);
  }
};

