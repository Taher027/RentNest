import ApiError from "../../error/ApiError";
import { prisma } from "../../lib/prisma";
import { TRentalRequest } from "./rentalRequest.interfaces";

const createRentalRequest = async (userId: string, payload: TRentalRequest) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  if (user.status === "BLOCKED" || user.status === "INACTIVE") {
    throw new ApiError(
      401,
      "You don't have access to create any rental Request",
    );
  }
  const existingUserRequest = await prisma.rentalRequest.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId: user.id,
        propertyId: payload.propertyId,
      },
    },
  });

  if (existingUserRequest) {
    if (existingUserRequest.status === "PENDING") {
      throw new ApiError(
        409,
        "You already have a pending request for this property",
      );
    }
    if (existingUserRequest.status === "APPROVED") {
      throw new ApiError(
        409,
        "Your request for this property has already been approved",
      );
    }
  }
  const approvedRequestForProperty = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: payload.propertyId,
      status: "APPROVED",
    },
  });

  if (approvedRequestForProperty) {
    throw new ApiError(
      409,
      "This property already has an approved rental request",
    );
  }

  const rental = await prisma.rentalRequest.create({
    data: {
      tenantId: userId,
      ...payload,
    },
  });
  return rental;
};

export const rentalRequestService = {
  createRentalRequest,
};
