import { suggestionSchema } from "./../shared/schemas/suggestion.schema";
import { Request, Response } from "express";
import {
  getAllSuggestionsByStatus,
  getSuggestionsBySuggestedByIdAndStatus,
  sendSuggestionService,
  updateSuggestionStatusService,
  addSuggestionToPostService,
  getPostSuggestions,
} from "../services/suggestion.services";
import { SuggestionStatus } from "@prisma/client";

export const sendSuggestionHandler = async (req: Request, res: Response) => {
  try {
    console.log("processing suggestion: ", req.body);

    const result = suggestionSchema.safeParse(req.body);

    if (!result.success) {
      console.log(result.error.errors);
      res
        .status(400)
        .send({ message: "Validation failed", errors: result.error.errors });
      return;
    }

    await sendSuggestionService(result.data);
    res.status(200).send({ message: "Suggestion processed successfully" });
  } catch (error) {
    console.error("Error processing suggestion:", error);
    res
      .status(500)
      .send({ message: "Internal server error", error: String(error) });
  }
};

export const updateSuggestionStatusHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    await updateSuggestionStatusService(status, parseInt(id));
    res.status(200).send({ message: "Suggestion status updated successfully" });
  } catch (error) {
    return res.send({
      message: "Error updating suggestion status",
      error: String(error),
    });
  }
};

export const getSuggestionsHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    let page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    if (page == 0) {
      page = 1;
    }
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    const suggestions = await getSuggestionsBySuggestedByIdAndStatus(
      parseInt(id),
      page,
      limit,
      status as SuggestionStatus
    );

    res.status(200).send(suggestions);
  } catch (error) {
    return res.status(500).send({
      message: "Error fetching suggestions",
      error: String(error),
    });
  }
};

export const getAllSuggestionsHandler = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    let page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    if (page == 0) {
      page = 1;
    }
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;
    const suggestions = await getAllSuggestionsByStatus(
      page,
      limit,
      status as SuggestionStatus
    );

    res.status(200).send(suggestions);
  } catch (error) {
    return res.status(500).send({
      message: "Error fetching suggestions",
      error: String(error),
    });
  }
};
