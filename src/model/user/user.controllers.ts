import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  return;
});

export const userControllers = {
  registerUser,
};
