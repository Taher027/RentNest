import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string,
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  } as SignOptions);
};

// const createResetToken = (
//   payload: any,
//   secret: Secret,
//   expireTime: string,
// ): string => {
//   return jwt.sign(payload, secret, {
//     algorithm: "HS256",
//     expiresIn: expireTime,
//   } as SignOptions);
// };

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
