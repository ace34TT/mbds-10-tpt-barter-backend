import { Request, Response } from "express";

export const getChatsHandler = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Chats get is working",
  });
};
