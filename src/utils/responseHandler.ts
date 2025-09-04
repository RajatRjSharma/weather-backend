import { Response } from "express";

interface ResponseOptions {
  res: Response;
  statusCode?: number; // HTTP status code
  message: string;
  data?: any; // optional data for success
}

export const sendResponse = ({
  res,
  statusCode = 200,
  message,
  data = null,
}: ResponseOptions) => {
  const isSuccess = statusCode >= 200 && statusCode < 300;

  return res.status(statusCode).json({
    status: isSuccess,
    message,
    data: isSuccess ? data : null,
  });
};
