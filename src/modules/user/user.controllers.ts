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
const getAllUsers = catchAsync(async (req, res) => {
  const result = await userServices.getAllUsersFromDb();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "ALL users retrieved successfull",
    data: result,
  });
});
const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userServices.getSingleUserFromDb(id as string);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User retrieved successfull",
    data: result,
  });
});

const updatedUserStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userRole = req.body;
  const result = await userServices.updatedUserRoleToDB(id as string, userRole);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User updated successfull",
    data: result,
  });
});
const deleteUsers = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const result = await userServices.deleteAllusersFromDB(userId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Users deleted successfull",
  });
});
export const userControllers = {
  registerUser,
  getAllUsers,
  getSingleUser,
  updatedUserStatus,
  deleteUsers,
};
