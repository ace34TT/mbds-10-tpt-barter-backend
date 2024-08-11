import express from "express";
import {
  continueChatHandler,
  createChatHandler,
  deleteChatHandler,
  getChatByIdHandler,
  getChatsByUserHandler
} from "../controllers/chat.controllers";

const router = express.Router();

router.get("/:id", getChatByIdHandler);
router.get("/user/:id", getChatsByUserHandler);
router.post("/", createChatHandler);
router.delete("/:id", deleteChatHandler);
router.patch("/continue/:id", continueChatHandler);

export { router as ChatRoutes };
