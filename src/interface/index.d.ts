import { User } from "../../prisma/generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
        role: User;
      };
    }
  }
}
