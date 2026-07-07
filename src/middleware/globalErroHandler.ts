import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import ApiError from "../error/ApiError";
import handleZodError from "../error/handleZodErrors";
import { IGenericErrorMessage } from "../types";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: IGenericErrorMessage[] = [];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;

    errorMessages = [
      {
        path: "",
        message: error.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
  });
};

export default globalErrorHandler;
