import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { rentalRequestService } from "./rentalRequest.services";
import { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
const createRentalRequest = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const payload = req.body;
  const result = await rentalRequestService.createRentalRequestToDB(
    userId as string,
    payload,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Create Rental Request Successfull",
    data: result,
  });
});
const getRentalRequest = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await rentalRequestService.getRentalRequestToDB(
    user as JwtPayload,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Get your rental  Successfull",
    data: result,
  });
});
const getRentalRequestDetails = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await rentalRequestService.getRentalRequestDetailsFromDB(
    id as string,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Get your rental  Successfull",
    data: result,
  });
});
const updatedRentalRequest = catchAsync(async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const { status } = req.body;
  const result = await rentalRequestService.updatedRentalRequestToDB(
    id as string,
    user as JwtPayload,
    status,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Updated rental  Successfull",
    data: result,
  });
});
export const rentalRequestController = {
  createRentalRequest,
  getRentalRequest,
  getRentalRequestDetails,
  updatedRentalRequest,
};
