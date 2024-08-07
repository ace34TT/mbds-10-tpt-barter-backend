import { Request, Response } from "express";
import * as notificationService from '../services/notification.services';
import mongoose from "mongoose";
import { validationResult } from "express-validator";

export const getNotificationsHandler = async (req: Request, res: Response) => {
  try {
    const notifications = await notificationService.getNotifications();
    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const addNotificationHandler = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, subject, message } = req.body;
    const notification = await notificationService.addNotification(userId, message, subject);
    res.status(201).json(notification);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};


export const getUserNotificationsHandler = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationService.getUserNotifications(parseInt(userId));
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const markNotificationAsReadHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const notification = await notificationService.markNotificationAsRead(id);
    if (notification) {
      res.status(200).json(notification);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getNotificationByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const notification = await notificationService.getNotificationById(id);
    if (notification) {
      res.status(200).json(notification);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

