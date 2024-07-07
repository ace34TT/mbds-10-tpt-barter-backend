export interface IMessage {
  author: string;
  text: string;
  timestamp: Date;
}

export interface IEmbedUser {
  id: string;
  name: string;
  username: string;
  email: string;
}

export interface IChat {
  sender: IEmbedUser;
  receiver: IEmbedUser;
  messages: IMessage[];
}
