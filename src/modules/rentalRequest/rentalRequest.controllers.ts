import status from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { rentalRequestService } from "./rentalRequest.services";

const createRentalRequest = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const payload = req.body;
  const result = await rentalRequestService.createRentalRequest(
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

export const rentalRequestController = {
  createRentalRequest,
};
