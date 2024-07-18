import { Request, Response, NextFunction } from "express";
import { logger } from "../shared/utils/errors/Logger";
import { BaseError } from "../shared/utils/errors/BaseError";

class ErrorHandler {
  public async handleError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    logger.error(
      "Error message from the centralized error-handling component",
      err
    );

    // Check if the error has been handled
    if (res.headersSent) {
      return next(err);
    }

    // Determine the HTTP status code based on the error
    const statusCode = err instanceof BaseError ? err.httpCode : 500;

    // Prepare the error response
    const errorResponse = {
      message: err.message || "An internal server error occurred",
      // Optionally include more details about the error for trusted operational errors
      ...(err instanceof BaseError &&
        err.isOperational && { details: err.description }),
    };
    console.log(errorResponse);

    // Send the error response
    res.status(statusCode).json(errorResponse);
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}

export const errorHandler = new ErrorHandler();
