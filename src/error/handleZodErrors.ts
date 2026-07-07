import { ZodError } from "zod";
import { IGenericErrorMessage, IGenericErrorResponse } from "../types";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errorMessages: IGenericErrorMessage[] = error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorMessages,
  };
};

export default handleZodError;
