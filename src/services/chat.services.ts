import { Chat } from "./../models/chats.models";
import { IChat, IMessage } from "../shared/interfaces/mongoModels.interfaces";

export const createChatService = async (chat: IChat) => {
  try {
    const _chat = new Chat({
      receiver: chat.receiver,
      sender: chat.sender,
      messages: chat.messages,
    });
    await _chat.save();
    return _chat;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error);
  }
};
export const continueChatService = (chatId: string, message: IMessage) => {
  try {
    const chat = Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: message } },
      { new: true }
    );
    return chat;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error);
  }
};
export const getChatByUserService = (userId: string) => {
  try {
    const chats = Chat.find({ "sender.id": userId }).exec();
    return chats;
  } catch (error: any) {
    console.log(error.message);
    throw new Error(error);
  }
};
export const getChatByIdService = (chatId: string) => {
  try {
    const chat = Chat.findById(chatId).exec();
    return chat;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const deleteChatByIdService = async (chatId: string) => {
  try {
    const chat = await Chat.findByIdAndDelete(chatId).exec();
    if (!chat) throw new Error(`Chat with ID ${chatId} not found`);
    return true;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while deleting the chat"
    );
  }
};
