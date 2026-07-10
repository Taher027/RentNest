import { z } from "zod";

const createPropertyZodSchema = z.object({
  title: z
    .string("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(255, "Title is too long"),

  description: z
    .string("Description is required")
    .min(10, "Description must be at least 10 characters"),

  categoryId: z.string("Category ID is required").uuid("Invalid category ID"),

  street: z
    .string("Street is required")
    .min(3, "Street must be at least 3 characters"),

  city: z
    .string("City is required")
    .min(2, "City must be at least 2 characters")
    .max(255, "City is too long"),

  price: z
    .number("Price is required")
    .positive("Price must be a positive number"),

  bedRooms: z
    .number("Bedrooms is required")
    .int("Bedrooms must be an integer")
    .positive("Bedrooms must be a positive number"),

  status: z.enum(["AVAILABLE", "RENTED", "UNAVAILABLE"]).optional(),

  areaSize: z
    .number("Area size is required And must be number")
    .positive("Area size must be a positive number"),

  images: z.array(z.url("Each image must be a valid URL")).optional(),
});

const updatePropertyZodSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().min(10).optional(),
  categoryId: z.string().uuid().optional(),
  street: z.string().min(3).optional(),
  city: z.string().min(2).max(255).optional(),
  price: z.number().positive().optional(),
  bedRooms: z.number().int().positive().optional(),
  status: z.enum(["AVAILABLE", "RENTED", "UNAVAILABLE"]).optional(),
  areaSize: z.number().positive().optional(),
  images: z.array(z.string().url()).optional(),
});

export const PropertyValidation = {
  createPropertyZodSchema,
  updatePropertyZodSchema,
};
