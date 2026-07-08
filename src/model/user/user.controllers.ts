import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { userServices } from "./user.services";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.createUserToDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User Registered Successfull",
    data: result,
  });
});

export const userControllers = {
  registerUser,
};
