import z from "zod";

export const createReviewSchema = z.object({
  propertyId: z.string("Property  id is required"),
  rating: z.number("ratingfield is required"),
  comment: z.string("Comment field is required"),
});
