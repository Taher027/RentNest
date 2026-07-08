import ApiError from "../../error/ApiError";
import { prisma } from "../../lib/prisma";

const createCategoryToDB = async (title: string) => {
  const ifExists = await prisma.category.findUnique({ where: { title } });
  if (ifExists) {
    throw new ApiError(409, "Category is already exists");
  }

  const category = await prisma.category.create({ data: { title } });
  return category;
};

const getAllCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany({});
  return categories;
};

export const categoryServices = {
  createCategoryToDB,
  getAllCategoriesFromDB,
};
