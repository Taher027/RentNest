import bcrypt from "bcryptjs";
import ApiError from "../../error/ApiError";
import { prisma } from "../../lib/prisma";
import { TLogin } from "./auth.interface";
import { jwtHelpers } from "../../shared/jwtHelpers";
import config from "../../config";

const userLoginToDB = async (payload: TLogin) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new ApiError(404, "Invalid creadentials");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new ApiError(404, "Invalid creadentials");
  }
  const payloadData = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwtHelpers.createToken(
    payloadData,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expireIn as string,
  );

  const refreshToken = jwtHelpers.createToken(
    payloadData,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expireIn as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const getMeFromDb = async (token: string) => {
  const userData = jwtHelpers.verifyToken(
    token,
    config.jwt_access_token_secret as string,
  );
  if (!userData) {
    throw new ApiError(401, "Access unauthorized please login.");
  }
  const { email } = userData;
  const user = await prisma.user.findUnique({
    where: { email },
    omit: { password: true },
  });

  return user;
};

export const authService = {
  userLoginToDB,
  getMeFromDb,
};
