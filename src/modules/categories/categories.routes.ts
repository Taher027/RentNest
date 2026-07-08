import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { categoriesSchema } from "./categories.validations";
import { categoriesControllers } from "./categories.controllers";
import { auth } from "../../middleware/auth";
const router = Router();

router.post(
  "/categories",
  auth("ADMIN"),
  validateRequest(categoriesSchema),
  categoriesControllers.createCategories,
);

router.get("/categories", categoriesControllers.getAllCategories);

export const categoriesRoute = router;
