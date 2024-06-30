import { Request, Response } from "express";

export const getNotificationsHandler = (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Notifications get is working",
  });
};
