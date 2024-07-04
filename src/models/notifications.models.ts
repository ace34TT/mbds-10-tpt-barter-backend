import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
    userId: number;
    subject: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: Number, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model<INotification>('Notifications', NotificationSchema);