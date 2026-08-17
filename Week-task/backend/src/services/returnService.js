const Return = require("../models/Return");
const Order = require("../models/Order");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const getReturns = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  reason,
} = {}) => {
  const pagination = getPagination(page, limit);

  const filter = {};

  if (search?.trim()) {
    filter.returnNumber = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  if (reason) {
    filter.reason = reason;
  }

  const [returns, total] = await Promise.all([
    Return.find(filter)
      .populate(
        "order",
        "_id orderNumber total status"
      )
      .populate(
        "customer",
        "_id firstName lastName email"
      )
      .populate(
        "items.product", // <-- FIXED FROM products.product TO items.product
        "_id name price image sku"
      )
      .populate(
        "exchangeProduct",
        "_id name price image sku"
      )
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    Return.countDocuments(filter),
  ]);

  return {
    returns,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getReturnById = async (returnId) => {
  const returnRequest = await Return.findById(returnId)
    .populate(
      "order",
      "_id orderNumber total status"
    )
    .populate(
      "customer",
      "_id firstName lastName email phone"
    )
    .populate(
      "items.product", // <-- FIXED FROM products.product TO items.product
      "_id name price image sku"
    )
    .populate(
      "exchangeProduct",
      "_id name price image sku"
    )
    .lean();

  if (!returnRequest) {
    throw new ApiError(
      404,
      "Return request not found",
      "RETURN_NOT_FOUND"
    );
  }

  return returnRequest;
};

const createReturn = async (returnData) => {
  const order = await Order.findById(returnData.order);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found",
      "ORDER_NOT_FOUND"
    );
  }

  const existingReturn = await Return.findOne({
    order: returnData.order,
    status: {
      $nin: ["Rejected", "Cancelled"],
    },
  }).lean();

  if (existingReturn) {
    throw new ApiError(
      409,
      "An active return already exists for this order",
      "RETURN_ALREADY_EXISTS"
    );
  }

  const returnNumber = `RET-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 7)
    .toUpperCase()}`;

  const returnRequest = await Return.create({
    ...returnData,
    returnNumber,
    status: "Requested",
  });

  return getReturnById(returnRequest._id);
};

const updateReturn = async (
  returnId,
  updateData
) => {
  const returnRequest =
    await Return.findByIdAndUpdate(
      returnId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!returnRequest) {
    throw new ApiError(
      404,
      "Return request not found",
      "RETURN_NOT_FOUND"
    );
  }

  return getReturnById(returnRequest._id);
};

const updateReturnStatus = async (
  returnId,
  status
) => {
  const allowedStatuses = [
    "Requested",
    "Approved",
    "Rejected",
    "Picked Up",
    "Received",
    "Refunded",
    "Exchanged",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid return status",
      "INVALID_RETURN_STATUS"
    );
  }

  const returnRequest =
    await Return.findByIdAndUpdate(
      returnId,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!returnRequest) {
    throw new ApiError(
      404,
      "Return request not found",
      "RETURN_NOT_FOUND"
    );
  }

  return getReturnById(returnRequest._id);
};

const approveReturn = async (returnId) => {
  return updateReturnStatus(
    returnId,
    "Approved"
  );
};

const rejectReturn = async (returnId) => {
  return updateReturnStatus(
    returnId,
    "Rejected"
  );
};

const processRefund = async (returnId) => {
  const returnRequest =
    await Return.findById(returnId);

  if (!returnRequest) {
    throw new ApiError(
      404,
      "Return request not found",
      "RETURN_NOT_FOUND"
    );
  }

  if (returnRequest.status !== "Received") {
    throw new ApiError(
      400,
      "Return must be received before refund",
      "RETURN_NOT_READY_FOR_REFUND"
    );
  }

  if (returnRequest.refundStatus === "Refunded") {
    throw new ApiError(
      409,
      "Refund has already been processed",
      "REFUND_ALREADY_PROCESSED"
    );
  }

  returnRequest.refundStatus = "Refunded";
  returnRequest.refundedAt = new Date();
  returnRequest.status = "Refunded";

  await returnRequest.save();

  return getReturnById(returnRequest._id);
};

const processExchange = async (returnId) => {
  const returnRequest =
    await Return.findById(returnId);

  if (!returnRequest) {
    throw new ApiError(
      404,
      "Return request not found",
      "RETURN_NOT_FOUND"
    );
  }

  if (
    !["Approved", "Received"].includes(
      returnRequest.status
    )
  ) {
    throw new ApiError(
      400,
      "Return is not eligible for exchange",
      "RETURN_NOT_ELIGIBLE_FOR_EXCHANGE"
    );
  }

  returnRequest.status = "Exchanged";
  returnRequest.exchangeRequested = true;

  await returnRequest.save();

  return getReturnById(returnRequest._id);
};

const cancelReturn = async (returnId) => {
  const returnRequest =
    await Return.findById(returnId);

  if (!returnRequest) {
    throw new ApiError(
      404,
      "Return request not found",
      "RETURN_NOT_FOUND"
    );
  }

  if (
    ["Refunded", "Exchanged"].includes(
      returnRequest.status
    )
  ) {
    throw new ApiError(
      400,
      "Completed return cannot be cancelled",
      "RETURN_CANNOT_BE_CANCELLED"
    );
  }

  returnRequest.status = "Cancelled";

  await returnRequest.save();

  return getReturnById(returnRequest._id);
};

module.exports = {
  getReturns,
  getReturnById,
  createReturn,
  updateReturn,
  updateReturnStatus,
  approveReturn,
  rejectReturn,
  processRefund,
  processExchange,
  cancelReturn,
};