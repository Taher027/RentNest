import { Router } from "express";
import { userControllers } from "./user.controllers";
import validateRequest from "../../middleware/validateRequest";
import { userValidation } from "./user.validationSchema";
const router = Router();

router.post(
  "/register",
  validateRequest(userValidation.createUserSchema),
  userControllers.registerUser,
);

export const userRoute = router;
