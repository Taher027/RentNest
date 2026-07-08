import { Router } from "express";
import { authController } from "./auth.controllers";
import validateRequest from "../../middleware/validateRequest";
import { authValidation } from "./auth.validation";
const router = Router();

router.post(
  "/login",
  validateRequest(authValidation.loginSchema),
  authController.userLogin,
);
router.get("/getme", authController.getMe);

export const authRouter = router;
