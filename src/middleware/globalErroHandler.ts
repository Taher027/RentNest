import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import ApiError from "../error/ApiError";
import handleZodError from "../error/handleZodErrors";
import { IGenericErrorMessage } from "../types";
import { Prisma } from "../../prisma/generated/prisma/client";
import handlePrismaClientKnownRequestError from "../error/handlePrismaError";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";
  let errorMessages: IGenericErrorMessage[] = [
    { path: "", message: error.message || "Something went wrong!" },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(error);

    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid data passed to database query";
    errorMessages = [{ path: "", message: error.message }];
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
