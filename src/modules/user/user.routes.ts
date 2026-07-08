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
router.get("/users", userControllers.getAllUsers);
router.delete("/users", userControllers.deleteUsers);

export const userRoute = router;
