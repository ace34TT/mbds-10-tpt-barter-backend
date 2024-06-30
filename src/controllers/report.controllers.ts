import { Request, Response } from "express";

export const getReportsHandler = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Reports get is working",
  });
};
