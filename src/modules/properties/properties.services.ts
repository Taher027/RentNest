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
  const data = await prisma.property.findUniqueOrThrow({ where: { id } });
  console.log(data, "inside single pro");
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
  console.log(id);
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
