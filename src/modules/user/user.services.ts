import bcrypt from "bcryptjs";
import ApiError from "../../error/ApiError";
import { prisma } from "../../lib/prisma";
import { IUser } from "./user.interfaces";
import config from "../../config";
import status from "http-status";
import { omit } from "zod/mini";

const createUserToDB = async (payload: IUser) => {
  const { email, password, ...rest } = payload;

  const ifExist = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (ifExist) {
    throw new ApiError(409, "User already Exist");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  const createdUser = await prisma.user.create({
    data: {
      ...rest,
      email,
      password: hashedPassword,
    },
    omit: {
      password: true,
    },
  });

  return createdUser;
};
const getAllUsersFromDb = async () => {
  const data = await prisma.user.findMany({ omit: { password: true } });
  return data;
};
const deleteAllusersFromDB = async () => {
  const data = await prisma.user.deleteMany({});
  return data;
};

export const userServices = {
  createUserToDB,
  getAllUsersFromDb,
  deleteAllusersFromDB,
};
