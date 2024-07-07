import { addNotificationHandler, getNotificationByIdHandler, getNotificationsHandler, getUserNotificationsHandler, markNotificationAsReadHandler } from "../controllers/notification.controllers";
import express from "express";

const router = express.Router();

router.get("/", getNotificationsHandler);
router.post('/', addNotificationHandler);
router.get('/:userId', getUserNotificationsHandler);
router.put('/:id/read', markNotificationAsReadHandler);
router.get('/:id', getNotificationByIdHandler);

export { router as NotificationRoutes };
