import { addNotificationHandler, getNotificationByIdHandler, getNotificationsHandler, getUserNotificationsHandler, markNotificationAsReadHandler } from "../controllers/notification.controllers";
import express from "express";
import { notificationValidation } from "../validators/notification.validators";

const router = express.Router();

router.get("/", getNotificationsHandler);
router.post('/',notificationValidation, addNotificationHandler);
router.get('/user/:userId', getUserNotificationsHandler);
router.put('/:id/read', markNotificationAsReadHandler);
router.get('/:id', getNotificationByIdHandler);

export { router as NotificationRoutes };
