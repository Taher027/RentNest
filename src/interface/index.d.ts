import { User, UserRole } from "../../prisma/generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        id: string;
        role: UserRole;
      };
    }
  }
}
