import {Chat} from "./../models/chats.models";
import {IChat, IMessage} from "../shared/interfaces/mongoModels.interfaces";

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
export const getChatByUserService = async (userId: string) => {
  try {
    return await Chat.aggregate([
      {
        $match: {
          $or: [
            { "sender.id": userId },
            { "receiver.id": userId },
          ],
        },
      },
      {
        $project: {
          sender: 1,
          receiver: 1,
          latestMessage: { $arrayElemAt: ["$messages", -1] }, // Get the last message from the messages array
        },
      },
    ]).exec();
  } catch (error: any) {
    throw new Error(error.message || error);
  }
};


export const getChatByIdService = async (chatId: string) => {
  try {
    console.log("finding chat with " , chatId)
    return await Chat.findById(chatId).exec();
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

export const findChatByParticipantsService = async (
  senderId: string,
  receiverId: string
) => {
  try {
    const result = await Chat.findOne({
      $or: [
        { $and: [{ "sender.id": senderId }, { "receiver.id": receiverId }] },
        { $and: [{ "sender.id": receiverId }, { "receiver.id": senderId }] },
      ],
    });

    return result;
  } catch (error) {
    throw error;
  }
};
