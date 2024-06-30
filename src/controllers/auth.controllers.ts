import { Request, Response } from "express";

export const signInHandler = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Success",
  });
};
