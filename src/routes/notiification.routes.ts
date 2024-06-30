import { getNotificationsHandler } from "./../controllers/notification.controllers";
import express from "express";

const router = express.Router();

router.get("/", getNotificationsHandler);

export { router as NotificationRoutes };
