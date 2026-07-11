import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import ApiError from "../../error/ApiError";

const initiatePaymentIntoDB = async (
  rentalRequestId: string,
  tenantId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { property: true, tenant: true, payment: true },
  });

  if (!rentalRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized for this payment",
    );
  }

  if (rentalRequest.status !== "APPROVED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payment can only be made for an approved rental request",
    );
  }

  if (rentalRequest.payment && rentalRequest.payment?.status === "PAID") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Payment already completed for this request",
    );
  }

  const transactionId = uuidv4();

  const payment = await prisma.payment.upsert({
    where: { rentalRequestId: rentalRequest.id },
    update: {
      transactionId,
      status: "PENDING",
      amount: rentalRequest.property.price,
    },
    create: {
      rentalRequestId: rentalRequest.id,
      tenantId,
      amount: rentalRequest.property.price,
      transactionId,
      status: "PENDING",
    },
  });

  const sslPayload = {
    store_id: config.store_id,
    store_passwd: config.store_password,
    total_amount: payment.amount,
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${config.backend_url}/api/payments/success/${transactionId}`,
    fail_url: `${config.backend_url}/api/payments/fail/${transactionId}`,
    cancel_url: `${config.backend_url}/api/payments/cancel/${transactionId}`,
    ipn_url: `${config.backend_url}/api/payments/ipn`,
    shipping_method: "NO",
    product_name: rentalRequest.property.title,
    product_category: "Rental",
    product_profile: "general",
    cus_name: rentalRequest.tenant.name,
    cus_email: rentalRequest.tenant.email,
    cus_add1: rentalRequest.tenant.address || "N/A",
    cus_city: rentalRequest.property.city,
    cus_postcode: "0000",
    cus_country: "Bangladesh",
    cus_phone: rentalRequest.tenant.phone,
    ship_name: rentalRequest.tenant.name,
    ship_add1: rentalRequest.tenant.address || "N/A",
    ship_city: rentalRequest.property.city,
    ship_postcode: "0000",
    ship_country: "Bangladesh",
  };

  const response = await axios({
    method: "POST",
    url: config.payment_api,
    data: sslPayload,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  if (!response.data?.GatewayPageURL) {
    throw new ApiError(
      httpStatus.BAD_GATEWAY,
      "Failed to initiate payment with SSLCommerz",
    );
  }

  return { paymentUrl: response.data.GatewayPageURL };
};

const validateAndCompletePayment = async (valId: string) => {
  const validationResponse = await axios.get(config.validation_api as string, {
    params: {
      val_id: valId,
      store_id: config.store_id,
      store_passwd: config.store_password,
      format: "json",
    },
  });

  const isValid =
    validationResponse.data?.status === "VALID" ||
    validationResponse.data?.status === "VALIDATED";

  const transactionId = validationResponse.data?.tran_id;

  if (!transactionId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid transaction reference from SSLCommerz",
    );
  }

  if (!isValid) {
    await prisma.payment.update({
      where: { transactionId },
      data: { status: "FAILED", paymentGatewayData: validationResponse.data },
    });
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment validation failed");
  }

  const updatedPayment = await prisma.payment.update({
    where: { transactionId },
    data: {
      status: "PAID",
      paymentGatewayData: validationResponse.data,
    },
  });

  return updatedPayment;
};

const markPaymentAs = async (
  transactionId: string,
  status: "FAILED" | "CANCELLED",
) => {
  const payment = await prisma.payment.findUnique({ where: { transactionId } });

  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment record not found");
  }

  const updatedPayment = await prisma.payment.update({
    where: { transactionId },
    data: { status },
  });

  return updatedPayment;
};

const getPaymentStatusFromDB = async (
  rentalRequestId: string,
  tenantId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    include: { payment: true },
  });

  if (!rentalRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Rental request not found");
  }

  if (rentalRequest.tenantId !== tenantId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to view this payment status",
    );
  }

  if (!rentalRequest.payment) {
    return {
      status: "NOT_INITIATED",
      message: "Payment has not been initiated yet for this rental request",
    };
  }

  return {
    status: rentalRequest.payment.status,
    amount: rentalRequest.payment.amount,
    transactionId: rentalRequest.payment.transactionId,
    updatedAt: rentalRequest.payment.updatedAt,
  };
};

export const paymentService = {
  initiatePaymentIntoDB,
  validateAndCompletePayment,
  markPaymentAs,
  getPaymentStatusFromDB,
};
