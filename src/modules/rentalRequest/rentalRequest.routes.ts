import { Router } from "express";
import { rentalRequestController } from "./rentalRequest.controllers";
import { auth } from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { rentalRequestSchemas } from "./rentalValidation";

const router = Router();
router.post(
  "/rentals",
  auth("TENANT"),
  rentalRequestController.createRentalRequest,
);
router.get(
  "/rentals",
  auth("TENANT", "ADMIN", "LANDLORD"),
  rentalRequestController.getRentalRequest,
);
router.get(
  "/rentals/:id",
  auth("TENANT", "ADMIN", "LANDLORD"),
  rentalRequestController.getRentalRequestDetails,
);
router.get(
  "/rentals/status/:id",
  auth("TENANT"),
  rentalRequestController.getRentalRequestHistory,
);
router.patch(
  "/rentals/:id",
  validateRequest(rentalRequestSchemas.updateRentalRequestSchema),
  auth("LANDLORD"),
  rentalRequestController.updatedRentalRequest,
);

export const rentalRequestRoutes = router;
