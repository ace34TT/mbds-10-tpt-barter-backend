import { Request, Response } from "express";

export const getUsersHandler = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Users get is working",
  });
};
