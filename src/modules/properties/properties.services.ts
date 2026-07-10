import { Prisma } from "../../../prisma/generated/prisma/client";
import ApiError from "../../error/ApiError";
import { prisma } from "../../lib/prisma";
import { TPropertyFilters } from "../../shared/pick";
import { TProperties } from "./properties.interface";
import httpStatus from "http-status";

const createPropertiesToDB = async (
  payload: TProperties,
  landlordId: string,
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: landlordId },
  });
  if (user.status === "BLOCKED" || user.status === "INACTIVE") {
    throw new ApiError(
      401,
      "You don't have Access to add properties. please contact suppport !",
    );
  }

  const data = await prisma.property.create({
    data: { landlordId: landlordId, ...payload },
    include: { landlord: true },
  });

  return data;
};
const getAllPropertiesFromDB = async (filters: TPropertyFilters) => {
  const {
    title,
    searchTerm,
    city,
    minPrice,
    maxPrice,
    bedRooms,
    status,
    categoryId,
  } = filters;

  const andConditions: Prisma.PropertyWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { city: { contains: searchTerm, mode: "insensitive" } },
        { street: { contains: searchTerm, mode: "insensitive" } },
      ],
    });
  }
  if (title) {
    andConditions.push({
      title: { contains: title, mode: "insensitive" },
    });
  }
  if (city) {
    andConditions.push({
      city: { equals: city, mode: "insensitive" },
    });
  }
  if (minPrice || maxPrice) {
    andConditions.push({
      price: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    });
  }
  if (bedRooms) {
    andConditions.push({
      bedRooms: Number(bedRooms),
    });
  }
  if (status) {
    andConditions.push({
      status: status,
    });
  }
  if (categoryId) {
    andConditions.push({
      categoryId: categoryId,
    });
  }
  const whereConditions: Prisma.PropertyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const data = await prisma.property.findMany({
    where: whereConditions,
    include: {
      category: true,
      landlord: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return data;
};
const getSinglePropertiesFromDB = async (id: string) => {
  const data = await prisma.property.findUniqueOrThrow({
    where: { id },
    include: { landlord: true },
  });

  return data;
};
const updatePropertiseToDB = async (
  userId: string,
  propertyId: string,
  payload: Partial<TProperties>,
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  if (userId !== property.landlordId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Unauthorized for this action !");
  }
  if (payload.status === "AVAILABLE" && property.status === "RENTED") {
    const activeApprovedRequest = await prisma.rentalRequest.findFirst({
      where: {
        propertyId: propertyId,
        status: "APPROVED",
      },
    });

    if (activeApprovedRequest) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot mark as available — there is an active approved rental request for this property",
      );
    }
  }
  const updateProperty = await prisma.property.update({
    where: { id: propertyId },
    data: { ...payload },
  });
  return updateProperty;
};
const getallOwnPropertiesFromDB = async (id: string) => {
  const data = await prisma.property.findMany({ where: { landlordId: id } });
  return data;
};
const deletePropertiesFromDB = async (
  userId: string,
  role: string,
  propertyId: string,
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  if (userId !== property.landlordId && role !== "ADMIN") {
    throw new ApiError(401, "Unauthorized for this action !");
  }
  const updateProperty = await prisma.property.delete({
    where: { id: propertyId },
  });
  return "success";
};
export const propertiesService = {
  createPropertiesToDB,
  getAllPropertiesFromDB,
  getSinglePropertiesFromDB,
  updatePropertiseToDB,
  getallOwnPropertiesFromDB,
  deletePropertiesFromDB,
};
