import { Router } from "express";
import { userControllers } from "./user.controllers";
import validateRequest from "../../middleware/validateRequest";
import { userValidation } from "./user.validationSchema";
import { auth } from "../../middleware/auth";
const router = Router();
const adminRoute = Router();

router.post(
  "/register",
  validateRequest(userValidation.createUserSchema),
  userControllers.registerUser,
);

adminRoute.get("/users", auth("ADMIN"), userControllers.getAllUsers);
adminRoute.patch(
  "/users/:id",
  validateRequest(userValidation.UserStatusSchema),
  auth("ADMIN"),
  userControllers.updatedUserStatus,
);
adminRoute.delete("/users", auth("ADMIN"), userControllers.deleteUsers);

export const userRoute = router;
export const userAdminRoute = adminRoute;
