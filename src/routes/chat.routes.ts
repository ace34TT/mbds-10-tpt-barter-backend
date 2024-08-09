import express from "express";
import {
  continueChatHandler,
  createChatHandler,
  deleteChatHandler,
  getChatByIdHandler,
} from "../controllers/chat.controllers";
import { getChatByUserService } from "../services/chat.services";

const router = express.Router();

router.get("/:id", getChatByIdHandler);
router.post("/", createChatHandler);
router.get("/:userId", getChatByUserService);
router.delete("/:id", deleteChatHandler);
router.patch("/continue/:id", continueChatHandler);

export { router as ChatRoutes };
