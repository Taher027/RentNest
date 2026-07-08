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
export const propertiesService = {
  createPropertiesToDB,
  getAllPropertiesFromDB,
  getSinglePropertiesFromDB,
};
