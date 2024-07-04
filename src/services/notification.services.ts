import { INotification, Notification } from "../models/notifications.models";

export const addNotification = async (userId: number, message: string, subject: string): Promise<INotification> => {
  const notification = new Notification({
    userId: userId,
    subject: subject,
    message: message,
    isRead: false,
    createdAt: new Date()
  });
  return await notification.save();
};

export const getUserNotifications = async (userId: number): Promise<INotification[]> => {
  return await Notification.find({ userId });
};

export const markNotificationAsRead = async (id: string): Promise<INotification | null> => {
  return await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
};

export const getNotificationById = async (id: string): Promise<INotification | null> => {
  return await Notification.findById(id);
};

export const getNotifications = async (): Promise<INotification[]> => {
  return await Notification.find();
};