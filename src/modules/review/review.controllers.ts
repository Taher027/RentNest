import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { reviewService } from "./review.services";

const createReview = catchAsync(async (req, res) => {
  const tenantId = req.user?.id as string;
  const payload = req.body;

  const result = await reviewService.createReviewIntoDB(tenantId, payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review added successfully",
    data: result,
  });
});

export const reviewController = { createReview };
