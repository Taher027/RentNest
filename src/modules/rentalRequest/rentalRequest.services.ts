import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../error/ApiError";
import { prisma } from "../../lib/prisma";
import { TRentalRequest } from "./rentalRequest.interfaces";
import { RequestStatus } from "../../../prisma/generated/prisma/enums";
import httpStatus from "http-status";

const createRentalRequestToDB = async (
  userId: string,
  payload: TRentalRequest,
) => {
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

const getRentalRequestToDB = async (user: JwtPayload) => {
  const { id, role } = user;
  let rental;
  if (role === "TENANT") {
    rental = await prisma.rentalRequest.findMany({
      where: { tenantId: id },
    });
  } else if (role === "LANDLORD") {
    rental = await prisma.rentalRequest.findMany({
      where: {
        property: {
          landlordId: id,
        },
      },
      include: {
        property: true,
        tenant: true,
      },
    });
  } else if (role === "ADMIN") {
    rental = await prisma.rentalRequest.findMany({});
  }

  return rental;
};
const getRentalRequestDetailsFromDB = async (id: string) => {
  const rentalDetails = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id },
    include: { property: true },
  });
  return rentalDetails;
};
const updatedRentalRequestToDB = async (
  rentalId: string,
  user: JwtPayload,
  Rentalstatus: RequestStatus,
) => {
  const { id: userId } = user;

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalId },
    include: { property: true },
  });

  if (!rentalRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rentalRequest.property.landlordId !== userId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this rental request",
    );
  }

  if (rentalRequest.status !== "PENDING") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This request is already ${rentalRequest.status.toLowerCase()}, cannot update again`,
    );
  }

  if (Rentalstatus === "APPROVED") {
    if (rentalRequest.property.status === "RENTED") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This property is already rented, cannot approve this request",
      );
    }

    const alreadyApproved = await prisma.rentalRequest.findFirst({
      where: {
        propertyId: rentalRequest.propertyId,
        status: "APPROVED",
      },
    });

    if (alreadyApproved) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "This property already has an approved rental request",
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedRental = await tx.rentalRequest.update({
      where: { id: rentalId },
      data: { status: Rentalstatus },
    });

    if (Rentalstatus === "APPROVED") {
      await tx.property.update({
        where: { id: rentalRequest.propertyId },
        data: { status: "RENTED" },
      });
    }

    return updatedRental;
  });

  return result;
};
const getRentalRequestHistoryFromDB = async (
  tenantId: string,
  rentalId: string,
) => {
  const rental = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id: rentalId },
  });
  if (tenantId !== rental.tenantId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this rental request",
    );
  }

  return { status: rental?.status };
};
export const rentalRequestService = {
  createRentalRequestToDB,
  getRentalRequestToDB,
  getRentalRequestDetailsFromDB,
  updatedRentalRequestToDB,
  getRentalRequestHistoryFromDB,
};
