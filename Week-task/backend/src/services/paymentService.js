const mongoose = require("mongoose");

const Order = require("../models/Order");
const Transaction = require("../models/Transaction");
const ApiError = require("../utils/ApiError");

const VALID_PAYMENT_METHODS = [
  "Cash on Delivery",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
];

const VALID_PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Failed",
  "Refunded",
  "Partially Refunded",
];

const generateTransactionNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(100000 + Math.random() * 900000);

  return `TXN-${timestamp}-${random}`;
};

const validateOrderId = (orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid order ID",
      "INVALID_ORDER_ID"
    );
  }
};

const getTransactions = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  paymentMethod,
  sortOrder = "desc",
} = {}) => {
  const parsedPage = Math.max(
    Number.parseInt(page, 10) || 1,
    1
  );

  const parsedLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || 10, 1),
    100
  );

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  const normalizedSearch = String(search).trim();

  if (normalizedSearch) {
    const safeSearch = normalizedSearch.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    filter.transactionNumber = {
      $regex: safeSearch,
      $options: "i",
    };
  }

  const skip = (parsedPage - 1) * parsedLimit;

  const sort = {
    createdAt: sortOrder === "asc" ? 1 : -1,
  };

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate(
        "order",
        "orderNumber total status"
      )
      .populate(
        "customer",
        "firstName lastName email"
      )
      .sort(sort)
      .skip(skip)
      .limit(parsedLimit)
      .lean(),

    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(
        total / parsedLimit
      ),
    },
  };
};

const getTransactionById = async (transactionId) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new ApiError(
      400,
      "Invalid transaction ID",
      "INVALID_TRANSACTION_ID"
    );
  }

  const transaction = await Transaction.findById(
    transactionId
  )
    .populate(
      "order",
      "orderNumber total status"
    )
    .populate(
      "customer",
      "firstName lastName email"
    )
    .lean();

  if (!transaction) {
    throw new ApiError(
      404,
      "Transaction not found",
      "TRANSACTION_NOT_FOUND"
    );
  }

  return transaction;
};

/*
 * Mock payment processing.
 *
 * No real payment gateway is used.
 */
const createPayment = async ({
  orderId,
  paymentMethod,
}) => {
  validateOrderId(orderId);

  if (
    !VALID_PAYMENT_METHODS.includes(paymentMethod)
  ) {
    throw new ApiError(
      400,
      "Invalid payment method",
      "INVALID_PAYMENT_METHOD"
    );
  }

  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw new ApiError(
      404,
      "Order not found",
      "ORDER_NOT_FOUND"
    );
  }

  const existingTransaction =
    await Transaction.findOne({
      order: orderId,
      status: "Paid",
    }).lean();

  if (existingTransaction) {
    throw new ApiError(
      409,
      "Order has already been paid",
      "ORDER_ALREADY_PAID"
    );
  }

  /*
   * Mock behavior:
   *
   * In development, payment succeeds immediately.
   *
   * Replace this section later with:
   * Stripe / Razorpay / PayPal / another gateway.
   */
  const transaction = await Transaction.create({
    transactionNumber:
      generateTransactionNumber(),

    order: order._id,

    customer: order.customer,

    amount: order.total,

    paymentMethod,

    status: "Paid",

    paymentReference: `MOCK-${Date.now()}`,

    paidAt: new Date(),
  });

  /*
   * Keep order payment state synchronized
   * if the Order model contains these fields.
   */
  await Order.findByIdAndUpdate(order._id, {
    paymentStatus: "Paid",
  });

  return transaction.toObject();
};

const markPaymentFailed = async (
  transactionId,
  reason
) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new ApiError(
      400,
      "Invalid transaction ID",
      "INVALID_TRANSACTION_ID"
    );
  }

  const transaction =
    await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: "Failed",
        failureReason: reason?.trim() || "",
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

  if (!transaction) {
    throw new ApiError(
      404,
      "Transaction not found",
      "TRANSACTION_NOT_FOUND"
    );
  }

  return transaction;
};

const processRefund = async (
  transactionId,
  refundAmount
) => {
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    throw new ApiError(
      400,
      "Invalid transaction ID",
      "INVALID_TRANSACTION_ID"
    );
  }

  const amount = Number(refundAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(
      400,
      "Refund amount must be greater than zero",
      "INVALID_REFUND_AMOUNT"
    );
  }

  const transaction =
    await Transaction.findById(transactionId);

  if (!transaction) {
    throw new ApiError(
      404,
      "Transaction not found",
      "TRANSACTION_NOT_FOUND"
    );
  }

  if (transaction.status !== "Paid" &&
      transaction.status !== "Partially Refunded") {
    throw new ApiError(
      409,
      "Transaction cannot be refunded",
      "TRANSACTION_NOT_REFUNDABLE"
    );
  }

  const alreadyRefunded =
    Number(transaction.refundedAmount || 0);

  const remainingAmount =
    transaction.amount - alreadyRefunded;

  if (amount > remainingAmount) {
    throw new ApiError(
      400,
      "Refund amount exceeds remaining payment amount",
      "REFUND_AMOUNT_EXCEEDED"
    );
  }

  const totalRefunded =
    alreadyRefunded + amount;

  transaction.refundedAmount = totalRefunded;

  transaction.status =
    totalRefunded === transaction.amount
      ? "Refunded"
      : "Partially Refunded";

  transaction.refundedAt = new Date();

  await transaction.save();

  await Order.findByIdAndUpdate(
    transaction.order,
    {
      paymentStatus:
        transaction.status === "Refunded"
          ? "Refunded"
          : "Partially Refunded",
    }
  );

  return transaction.toObject();
};

const getPaymentStatus = async (orderId) => {
  validateOrderId(orderId);

  const transaction = await Transaction.findOne({
    order: orderId,
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!transaction) {
    return {
      status: "Pending",
      transaction: null,
    };
  }

  return {
    status: transaction.status,
    transaction,
  };
};

module.exports = {
  getTransactions,
  getTransactionById,
  createPayment,
  markPaymentFailed,
  processRefund,
  getPaymentStatus,
  VALID_PAYMENT_METHODS,
  VALID_PAYMENT_STATUSES,
};