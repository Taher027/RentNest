import { User, UserRole } from "../../prisma/generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        id: string;
        role: UserRole;
      };
    }
  }
}
