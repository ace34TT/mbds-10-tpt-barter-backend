import express from "express";
import { getUsersHandler } from "../controllers/user.controllers";

const router = express.Router();

router.get("/", getUsersHandler);

export { router as UserRoutes };
