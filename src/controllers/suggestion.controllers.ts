import { suggestionSchema } from "./../shared/schemas/suggestion.schema";
import { Request, Response } from "express";
import {
  sendSuggestionService,
  updateSuggestionStatusService,
} from "../services/suggestion.services";

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
