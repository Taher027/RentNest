import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controllers";
import { auth } from "../../middleware/auth";

const router = Router();
router.post(
  "/rentals",
  auth("TENANT"),
  rentalRequestController.createRentalRequest,
);

export const rentalRequestRoutes = router;
