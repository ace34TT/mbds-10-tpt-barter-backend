import express from "express";
import { signInHandler } from "../controllers/auth.controllers";

const router = express.Router();

router.post("/sign-in", signInHandler);
export { router as AuthRoutes };
