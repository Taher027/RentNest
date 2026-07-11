import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { paymentService } from "./payment.services";
import config from "../../config";
import catchAsync from "../../shared/catchAsync";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const { rentalRequestId } = req.body;
  const tenantId = req.user?.id as string;

  const result = await paymentService.initiatePaymentIntoDB(
    rentalRequestId,
    tenantId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

const paymentSuccess = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const valId = req.body.val_id || req.query.val_id;

  await paymentService.validateAndCompletePayment(valId as string);

  return res.redirect(
    `${config.frontend_url}/payment/success?transactionId=${transactionId}`,
  );
});

const paymentFail = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  await paymentService.markPaymentAs(transactionId as string, "FAILED");
  return res.redirect(
    `${config.frontend_url}/payment/fail?transactionId=${transactionId}`,
  );
});

const paymentCancel = catchAsync(async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  await paymentService.markPaymentAs(transactionId as string, "CANCELLED");
  return res.redirect(
    `${config.frontend_url}/payment/cancel?transactionId=${transactionId}`,
  );
});

const paymentIPN = catchAsync(async (req: Request, res: Response) => {
  const valId = req.body.val_id;
  if (valId) {
    await paymentService.validateAndCompletePayment(valId);
  }
  res.status(200).send("IPN received");
});

export const paymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  paymentIPN,
};
