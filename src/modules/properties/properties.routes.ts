import { Router } from "express";
import { propertiesController } from "./properties.controllers";
import validateRequest from "../../middleware/validateRequest";
import { PropertyValidation } from "./properties.validations";
import { auth } from "../../middleware/auth";
const router = Router();
router.post(
  "/properties",
  auth("ADMIN", "LANDLORD"),
  validateRequest(PropertyValidation.createPropertyZodSchema),
  propertiesController.createProperties,
);
export const propertiesRoutes = router;
