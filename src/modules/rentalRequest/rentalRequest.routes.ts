import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controllers";
import { auth } from "../../middleware/auth";

const router = Router();
router.post(
  "/rentals",
  auth("TENANT"),
  rentalRequestController.createRentalRequest,
);
router.get(
  "/rentals",
  auth("TENANT"),
  rentalRequestController.getRentalRequest,
);
router.get(
  "/rentals/:id",
  auth("TENANT", "ADMIN", "LANDLORD"),
  rentalRequestController.getRentalRequestDetails,
);

export const rentalRequestRoutes = router;
