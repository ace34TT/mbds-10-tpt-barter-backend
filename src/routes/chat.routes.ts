import express from "express";
import {
  continueChatHandler,
  createChatHandler,
  deleteChatHandler,
  getChatByIdHandler,
  getChatByParticipantsHandler, getChatsByUserHandler,
} from "../controllers/chat.controllers";
import { getChatByUserService } from "../services/chat.services";

const router = express.Router();

router.get("/:id", getChatByIdHandler);
router.post("/", createChatHandler);
router.get("/user/:userId", getChatsByUserHandler);
router.delete("/:id", deleteChatHandler);
router.patch("/continue/:id", continueChatHandler);
router.get("/participant/:senderId/:receiverId", getChatByParticipantsHandler);
export { router as ChatRoutes };
