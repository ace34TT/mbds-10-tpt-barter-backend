import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema({
  author: { type: String },
  text: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const UserSchema = new Schema({
  id: { type: String },
  name: { type: String },
  username: { type: String },
  email: { type: String },
});

const ChatSchema = new Schema({
  sender: UserSchema,
  receiver: UserSchema,
  messages: [MessageSchema],
});

export const Message = mongoose.model("Message", MessageSchema);
export const Chat = mongoose.model("Chat", ChatSchema);
