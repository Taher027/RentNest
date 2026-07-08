import { Request, Response, NextFunction } from "express";
import catchAsync from "../shared/catchAsync";
import { jwtHelpers } from "../shared/jwtHelpers";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../prisma/generated/prisma/enums";
import { prisma } from "../lib/prisma";
import ApiError from "../error/ApiError";

export const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization?.split(" ")[1]
          : req.headers.authorization;

      if (!token) {
        throw new ApiError(
          401,
          "You are not logged in. Please log in to access this resource.",
        );
      }
      console.log(token, "inside auth.ts");
      const verifiedToken = jwtHelpers.verifyToken(
        token,
        config.jwt_access_token_secret as string,
      );
      console.log(verifiedToken, "insdie auth.ts");

      if (!verifiedToken.success) {
        throw new ApiError(401, verifiedToken.error);
      }

      const { email, id, role } = verifiedToken.data as JwtPayload;
      console.log("email:", email, "role:", role);

      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new ApiError(401, "Unauthorized access.");
      }

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new ApiError(404, "User not found. Please log in again.");
      }

      if (user.status === "BLOCKED") {
        throw new ApiError(
          403,
          "Your account has been blocked. Please contact support.",
        );
      }

      req.user = {
        email,
        id,
        role,
      };

      next();
    } catch (error) {
      next(error);
    }
  });
};
