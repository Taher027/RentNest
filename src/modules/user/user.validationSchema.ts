import { z } from "zod";
import { UserRole } from "../../../prisma/generated/prisma/enums";

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(255, "Name can't exceed 255 characters."),

  email: z
    .email("valid email required")
    .max(255, "email can't exceed 255 charecters"),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number is too short.")
    .max(20, "Phone number can't exceed 20 characters."),

  nidNumber: z
    .string()
    .trim()
    .min(5, "NID number is required.")
    .max(50, "NID number can't exceed 50 characters."),

  role: z.enum(UserRole).optional(),

  avatar: z.url("Avatar must be url"),

  address: z.string().trim(),

  isVerified: z.boolean().optional(),
});

const UserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "BLOCKED"]),
});
export const userValidation = {
  createUserSchema,
  UserStatusSchema,
};
