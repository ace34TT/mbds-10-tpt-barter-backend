export interface IMessage {
  // for socket purposes
    clientId : string ;
  //
  author: string;
  text: string;
  timestamp: Date;
}

export interface IEmbedUser {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface IChat {
  sender: IEmbedUser;
  receiver: IEmbedUser;
  messages: IMessage[];
}
