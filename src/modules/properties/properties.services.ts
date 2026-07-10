import ApiError from "../../error/ApiError";
import { prisma } from "../../lib/prisma";
import { TProperties } from "./properties.interface";

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
const getAllPropertiesFromDB = async () => {
  const data = await prisma.property.findMany({});
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
    throw new ApiError(401, "Unauthorized for this action !");
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
