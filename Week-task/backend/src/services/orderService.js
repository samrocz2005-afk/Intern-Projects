const mongoose = require("mongoose");

// Force Mongoose to register the Customer model for population
require("../models/Customer");

const Order = require("../models/Order");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const Customer = require("../models/Customer");
const ApiError = require("../utils/ApiError");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const ALLOWED_SORT_FIELDS = [
  "createdAt",
  "updatedAt",
  "total",
  "status",
];

const VALID_ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
  "Cancelled",
];

const parsePagination = (page, limit) => {
  const parsedPage = Number.parseInt(page, 10) || DEFAULT_PAGE;
  const parsedLimit = Number.parseInt(limit, 10) || DEFAULT_LIMIT;

  return {
    page: Math.max(parsedPage, 1),
    limit: Math.min(Math.max(parsedLimit, 1), MAX_LIMIT),
  };
};

const getOrders = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  search = "",
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const pagination = parsePagination(page, limit);

  const filter = {};

  if (status) {
    filter.status = status;
  }

  const normalizedSearch = String(search).trim();

  if (normalizedSearch) {
    filter.orderNumber = {
      $regex: normalizedSearch.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      ),
      $options: "i",
    };
  }

  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : "createdAt";

  const sort = {
    [safeSortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const skip = (pagination.page - 1) * pagination.limit;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("customer", "firstName lastName email phone name")
      .populate("items.product", "name sku price image")
      .sort(sort)
      .skip(skip)
      .limit(pagination.limit)
      .lean(),

    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getOrderById = async (orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid order ID",
      "INVALID_ORDER_ID"
    );
  }

  const order = await Order.findById(orderId)
    .populate(
      "customer",
      "firstName lastName email phone name"
    )
    .populate(
      "items.product",
      "name sku price image"
    )
    .lean();

  if (!order) {
    throw new ApiError(
      404,
      "Order not found",
      "ORDER_NOT_FOUND"
    );
  }

  return order;
};

const createOrder = async (customerId, orderData) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    discount = 0,
    shippingCost = 0,
  } = orderData;

  const resolvedCustomerId = customerId || orderData.customer;

  if (!resolvedCustomerId || !mongoose.Types.ObjectId.isValid(resolvedCustomerId)) {
    throw new ApiError(
      400,
      "Invalid or missing customer ID",
      "INVALID_CUSTOMER_ID"
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(
      400,
      "Order must contain at least one item",
      "EMPTY_ORDER"
    );
  }

  const productIds = items.map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },
  });

  if (products.length !== productIds.length) {
    throw new ApiError(
      404,
      "One or more products were not found",
      "PRODUCT_NOT_FOUND"
    );
  }

  const productMap = new Map(
    products.map((product) => [
      product._id.toString(),
      product,
    ])
  );

  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    if (
      !mongoose.Types.ObjectId.isValid(item.product)
    ) {
      throw new ApiError(
        400,
        "Invalid product ID",
        "INVALID_PRODUCT_ID"
      );
    }

    const quantity = Number(item.quantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new ApiError(
        400,
        "Product quantity must be a positive integer",
        "INVALID_QUANTITY"
      );
    }

    const product = productMap.get(
      item.product.toString()
    );

    if (!product) {
      throw new ApiError(
        404,
        "Product not found",
        "PRODUCT_NOT_FOUND"
      );
    }

    if (product.stock < quantity) {
      throw new ApiError(
        409,
        `Insufficient stock for ${product.name}`,
        "INSUFFICIENT_STOCK"
      );
    }

    const itemTotal = product.price * quantity;

    subtotal += itemTotal;

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity,
      price: product.price,
      total: itemTotal,
      subtotal: itemTotal,
    });

    const stockResult = await Product.updateOne(
      {
        _id: product._id,
        stock: { $gte: quantity },
      },
      {
        $inc: {
          stock: -quantity,
        },
      }
    );

    if (stockResult.modifiedCount !== 1) {
      throw new ApiError(
        409,
        `Unable to reserve stock for ${product.name}`,
        "STOCK_UPDATE_FAILED"
      );
    }

    await Inventory.updateOne(
      {
        product: product._id,
      },
      {
        $inc: {
          quantity: -quantity,
        },
      }
    );
  }

  const normalizedDiscount = Number(discount);
  const normalizedShippingCost = Number(shippingCost);

  if (
    !Number.isFinite(normalizedDiscount) ||
    normalizedDiscount < 0
  ) {
    throw new ApiError(
      400,
      "Invalid discount amount",
      "INVALID_DISCOUNT"
    );
  }

  if (
    !Number.isFinite(normalizedShippingCost) ||
    normalizedShippingCost < 0
  ) {
    throw new ApiError(
      400,
      "Invalid shipping cost",
      "INVALID_SHIPPING_COST"
    );
  }

  const total = Math.max(
    0,
    subtotal -
      normalizedDiscount +
      normalizedShippingCost
  );

  const orderNumber = `ORD-${Date.now()}-${Math.floor(
    Math.random() * 10000
  )}`;

  const order = await Order.create({
    orderNumber,
    customer: resolvedCustomerId,
    items: orderItems,
    subtotal,
    discount: normalizedDiscount,
    shippingCost: normalizedShippingCost,
    total,
    paymentMethod,
    shippingAddress,
    status: "Pending",
  });

  return Order.findById(order._id)
    .populate(
      "customer",
      "firstName lastName email phone name"
    )
    .populate(
      "items.product",
      "name sku price image"
    )
    .lean();
};

const updateOrder = async (
  orderId,
  updateData
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid order ID",
      "INVALID_ORDER_ID"
    );
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate(
      "customer",
      "firstName lastName email phone name"
    )
    .populate(
      "items.product",
      "name sku price image"
    )
    .lean();

  if (!order) {
    throw new ApiError(
      404,
      "Order not found",
      "ORDER_NOT_FOUND"
    );
  }

  return order;
};

const updateOrderStatus = async (
  orderId,
  status
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid order ID",
      "INVALID_ORDER_ID"
    );
  }

  if (!VALID_ORDER_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      "Invalid order status",
      "INVALID_ORDER_STATUS"
    );
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!order) {
    throw new ApiError(
      404,
      "Order not found",
      "ORDER_NOT_FOUND"
    );
  }

  return order;
};

const cancelOrder = async (orderId) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid order ID",
      "INVALID_ORDER_ID"
    );
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found",
      "ORDER_NOT_FOUND"
    );
  }

  if (
    ["Delivered", "Completed", "Cancelled"].includes(
      order.status
    )
  ) {
    throw new ApiError(
      409,
      `Order cannot be cancelled because it is ${order.status}`,
      "ORDER_CANNOT_BE_CANCELLED"
    );
  }

  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product },
      {
        $inc: {
          stock: item.quantity,
        },
      }
    );

    await Inventory.updateOne(
      { product: item.product },
      {
        $inc: {
          quantity: item.quantity,
        },
      }
    );
  }

  order.status = "Cancelled";
  await order.save();

  return order.toObject();
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
  cancelOrder,
};