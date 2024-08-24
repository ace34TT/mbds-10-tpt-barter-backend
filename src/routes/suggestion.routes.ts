import { Router } from "express";
import {
  getSuggestionByUserHandler,
  sendSuggestionHandler,
  updateSuggestionStatusHandler,
} from "../controllers/suggestion.controllers";

const router = Router();

router.post("/send", sendSuggestionHandler);
router.patch("/status/:id", updateSuggestionStatusHandler);
router.get("/user/:userId", getSuggestionByUserHandler)
export { router as SuggestionRoutes };
