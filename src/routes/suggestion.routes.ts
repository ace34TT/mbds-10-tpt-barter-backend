import { Router } from "express";
import {
  sendSuggestionHandler,
  updateSuggestionStatusHandler,
} from "../controllers/suggestion.controllers";

const router = Router();

router.post("/send", sendSuggestionHandler);
router.patch("/status/:id", updateSuggestionStatusHandler);
export { router as SuggestionRoutes };
