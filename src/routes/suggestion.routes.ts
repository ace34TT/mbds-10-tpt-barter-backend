import { Router } from "express";
import {
  sendSuggestionHandler,
  updateSuggestionStatusHandler,
  getSuggestions,
  addSuggestionToPost
} from "../controllers/suggestion.controllers";

const router = Router();

router.post("/send", sendSuggestionHandler);
router.patch("/status/:id", updateSuggestionStatusHandler);
router.get("/:id", getSuggestions);
router.post("/:id", addSuggestionToPost);
export { router as SuggestionRoutes };
