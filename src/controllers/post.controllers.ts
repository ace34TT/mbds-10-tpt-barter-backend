import { Request, Response } from "express";

export const getPostsHandler = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Posts get is working",
  });
};
