import express from "express";
import { auth } from "../../middleware/auth";
import { reviewController } from "./review.controllers";
import validateRequest from "../../middleware/validateRequest";
import { createReviewSchema } from "./reviewSchema";

const router = express.Router();

router.post(
  "/",
  validateRequest(createReviewSchema),
  auth("TENANT"),
  reviewController.createReview,
);

export const reviewRoutes = router;
