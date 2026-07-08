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
router.post(
  "/properties/:id",
  auth("LANDLORD"),
  propertiesController.updateProperties,
);
router.get("/properties", propertiesController.getAllProperties);
router.get("/properties/:id", propertiesController.getSingleProperties);
export const propertiesRoutes = router;
