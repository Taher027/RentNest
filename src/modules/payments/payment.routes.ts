import express from "express";
import { auth } from "../../middleware/auth";
import { paymentController } from "./payment.controllers";

const router = express.Router();

router.post("/initiate", auth("TENANT"), paymentController.initiatePayment);

router.all("/success/:transactionId", paymentController.paymentSuccess);
router.all("/fail/:transactionId", paymentController.paymentFail);
router.all("/cancel/:transactionId", paymentController.paymentCancel);
router.all("/ipn", paymentController.paymentIPN);

export const paymentRoutes = router;
