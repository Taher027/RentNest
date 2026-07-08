import ApiError from "../../error/ApiError";
import { prisma } from "../../lib/prisma";
import { TProperties } from "./properties.interface";

const createPropertiesToDB = async (
  payload: TProperties,
  landlordId: string,
) => {
  const data = await prisma.property.create({
    data: { landlordId: landlordId, ...payload },
  });
  console.log("property: ", data);
  return data;
};
const getAllPropertiesFromDB = async () => {
  const data = await prisma.property.findMany({});
  return data;
};
const getSinglePropertiesFromDB = async (id: string) => {
  const data = await prisma.property.findUnique({ where: { id } });
  return data;
};
const updatePropertiseToDB = async (
  userId: string,
  propertyId: string,
  payload: Partial<TProperties>,
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new ApiError(404, "Property not found !");
  }

  if (userId !== property.landlordId) {
    throw new ApiError(401, "Unauthorized for this action !");
  }
  const updateProperty = await prisma.property.update({
    where: { id: propertyId },
    data: { ...payload },
  });
  return updateProperty;
};
export const propertiesService = {
  createPropertiesToDB,
  getAllPropertiesFromDB,
  getSinglePropertiesFromDB,
  updatePropertiseToDB,
};
