import { Router } from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";
const router = Router();

router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  authController.userLogin,
);

export const authRouter = router;
