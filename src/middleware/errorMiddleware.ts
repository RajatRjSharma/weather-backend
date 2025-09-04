import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/errors";
import { sendResponse } from "../utils/responseHandler";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);

  if (err instanceof HttpError) {
    return sendResponse({
      res,
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Default for unknown errors
  sendResponse({
    res,
    statusCode: 500,
    message: "Internal Server Error",
  });
}
