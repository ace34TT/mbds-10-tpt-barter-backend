import { Router } from "express";
import {
  getAllSuggestionsHandler,
  getSuggestionsHandler,
  sendSuggestionHandler,
  updateSuggestionStatusHandler,
  getSuggestions,
  addSuggestionToPost
} from "../controllers/suggestion.controllers";

const router = Router();

router.get("/", getAllSuggestionsHandler);
router.get("/user/:id", getSuggestionsHandler);
router.post("/send", sendSuggestionHandler);
router.patch("/status/:id", updateSuggestionStatusHandler);
router.get("/:id", getSuggestions);
router.post("/:id", addSuggestionToPost);
export { router as SuggestionRoutes };
