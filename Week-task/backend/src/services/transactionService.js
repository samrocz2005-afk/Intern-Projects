const Transaction = require("../models/Transaction");
const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");

const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const getTransactions = async ({
  page = 1,
  limit = 10,
  status,
  paymentMethod,
  search,
  sortOrder = "desc",
} = {}) => {
  const pagination = getPagination(page, limit);

  const filter = {};

  if (status) {
    filter.paymentStatus = status;
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  if (search?.trim()) {
    filter.transactionId = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  const sort =
    sortOrder === "asc"
      ? { createdAt: 1 }
      : { createdAt: -1 };

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
        .populate({
          path: "customer",
          select: "_id firstName lastName email",
        })
        .populate({
          path: "order",
          select: "_id orderNumber total status customer",
          populate: {
            path: "customer",
            select: "_id firstName lastName email",
          },
        })
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),

    Transaction.countDocuments(filter),
  ]);

  return {
    transactions,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getTransactionById = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId)
    .populate({
      path: "customer",
      select: "_id name email",
    })
    .populate({
      path: "order",
      select: "_id orderNumber total status customer",
    })
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

const createMockTransaction = async ({ orderId, paymentMethod }) => {
  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw new ApiError(404, "Order not found", "ORDER_NOT_FOUND");
  }

  const existingTransaction = await Transaction.findOne({
    order: orderId,
  }).lean();

  if (existingTransaction) {
    throw new ApiError(
      409,
      "Transaction already exists for this order",
      "TRANSACTION_ALREADY_EXISTS"
    );
  }

  const transactionId = `MOCK-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  const transaction = await Transaction.create({
    transactionId,
    order: orderId,
    customer: order.customer, // Links customer directly from order
    amount: order.total,
    paymentMethod: paymentMethod || "Cash on Delivery",
    paymentStatus: "Paid",
    refundStatus: "Not Refunded",
  });

  return transaction;
};

const updatePaymentStatus = async (transactionId, paymentStatus) => {
  const allowedStatuses = ["Pending", "Paid", "Failed", "Cancelled"];

  if (!allowedStatuses.includes(paymentStatus)) {
    throw new ApiError(400, "Invalid payment status", "INVALID_PAYMENT_STATUS");
  }

  const transaction = await Transaction.findByIdAndUpdate(
    transactionId,
    {
      $set: {
        paymentStatus,
      },
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

const processMockRefund = async (transactionId) => {
  const transaction = await Transaction.findById(transactionId);

  if (!transaction) {
    throw new ApiError(
      404,
      "Transaction not found",
      "TRANSACTION_NOT_FOUND"
    );
  }

  if (transaction.paymentStatus !== "Paid") {
    throw new ApiError(
      400,
      "Only paid transactions can be refunded",
      "TRANSACTION_NOT_REFUNDABLE"
    );
  }

  if (transaction.refundStatus === "Refunded") {
    throw new ApiError(
      409,
      "Transaction has already been refunded",
      "ALREADY_REFUNDED"
    );
  }

  transaction.refundStatus = "Refunded";
  transaction.refundedAt = new Date();

  await transaction.save();

  return transaction.toObject();
};

module.exports = {
  getTransactions,
  getTransactionById,
  createMockTransaction,
  updatePaymentStatus,
  processMockRefund,
};