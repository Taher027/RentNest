import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { rentalRequestService } from "./rentalRequest.services";

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
  const userId = req.user?.id;
  console.log(userId, "get rental controller");
  const result = await rentalRequestService.getRentalRequestToDB(
    userId as string,
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

export const rentalRequestController = {
  createRentalRequest,
  getRentalRequest,
  getRentalRequestDetails,
};
