import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.services";
import sendResponse from "../../shared/sendResponse";
import status from "http-status";

const userLogin = catchAsync(async (req: Request, res: Response) => {
  console.log("hit route");
  const result = await authService.userLoginToDB(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User login successfull!",
    data: result,
  });
});
const getMe = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.accessToken;
  const result = await authService.getMeFromDb(token as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved Successfull",
    data: result,
  });
});

export const authController = {
  userLogin,
  getMe,
};
