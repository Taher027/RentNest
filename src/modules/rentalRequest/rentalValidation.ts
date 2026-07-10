import z from "zod";
import { RequestStatus } from "../../../prisma/generated/prisma/enums";

const createRentalRequestSchema = z.object({
  propertyId: z.string("Property is required"),
  moveInDate: z.date("Move in time is required !"),
  moveOutDate: z.date("Move out time is required !"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
  message: z.string().optional(),
});

const updateRentalRequestSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]),
});

export const rentalRequestSchemas = {
  createRentalRequestSchema,
  updateRentalRequestSchema,
};
