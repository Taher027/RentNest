import { prisma } from "../../lib/prisma";
import { TProperties } from "./properties.interface";

const createCategoriesToDB = async (payload: TProperties) => {
  console.log(payload);
  const landlord = await prisma.user.findUnique({
    where: { id: payload.landlordId },
  });
};
export const propertiesService = {
  createCategoriesToDB,
};
