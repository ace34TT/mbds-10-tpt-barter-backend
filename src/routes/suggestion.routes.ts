import { Router } from "express";
import {
  getAllSuggestionsHandler,
  getSuggestionsHandler,
  sendSuggestionHandler,
  updateSuggestionStatusHandler,
} from "../controllers/suggestion.controllers";

const router = Router();

router.get("/", getAllSuggestionsHandler);
router.get("/user/:id", getSuggestionsHandler);
router.post("/send", sendSuggestionHandler);
router.patch("/status/:id", updateSuggestionStatusHandler);
export { router as SuggestionRoutes };
