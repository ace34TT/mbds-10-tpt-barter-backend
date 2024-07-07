import express from "express";
import {
  continueChatHandler,
  createChatHandler,
  deleteChatHandler,
  getChatByIdHandler,
} from "../controllers/chat.controllers";

const router = express.Router();

router.get("/:id", getChatByIdHandler);
router.post("/", createChatHandler);
router.delete("/:id", deleteChatHandler);
router.patch("/continue/:id", continueChatHandler);

export { router as ChatRoutes };
