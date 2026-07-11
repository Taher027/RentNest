import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import ApiError from "../../error/ApiError";

const createReviewIntoDB = async (
  tenantId: string,
  payload: { propertyId: string; rating: number; comment: string },
) => {
  const { propertyId, rating, comment } = payload;
  console.log(propertyId, "propertyId");
  console.log(tenantId, "tentat");

  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: { propertyId },
    include: { payment: true },
  });
  console.log(rentalRequest);
  if (!rentalRequest) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can only review a property you have an approved rental request for",
    );
  }

  if (!rentalRequest.payment || rentalRequest.payment.status !== "PAID") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can only review after completing the payment",
    );
  }

  const existingReview = await prisma.review.findUnique({
    where: { tenantId_propertyId: { tenantId, propertyId } },
  });

  if (existingReview) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already reviewed this property",
    );
  }

  const review = await prisma.review.create({
    data: { tenantId, propertyId, rating, comment },
  });

  return review;
};

export const reviewService = {
  createReviewIntoDB,
};
