const mongoose = require("mongoose");

const Shipment = require("../models/Shipment");
const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");

const VALID_SHIPMENT_STATUSES = [
  "Processing",
  "In Transit",
  "Delivered",
  "Delayed",
  "Cancelled",
];

const generateTrackingId = () => {
  const timestamp = Date.now();
  const random = Math.floor(
    100000 + Math.random() * 900000
  );

  return `TRK-${timestamp}-${random}`;
};

const validateId = (
  value,
  message,
  errorCode
) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new ApiError(
      400,
      message,
      errorCode
    );
  }
};

const getShipments = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  carrier,
} = {}) => {
  const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 10, 1), 100);

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (carrier) {
    filter.carrier = carrier;
  }

  const normalizedSearch = String(search).trim();

  if (normalizedSearch) {
    const safeSearch = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.trackingId = {
      $regex: safeSearch,
      $options: "i",
    };
  }

  const skip = (parsedPage - 1) * parsedLimit;

  const [shipments, total] = await Promise.all([
  Shipment.find(filter)
    .populate({
      path: "order",
      select: "orderNumber total status customer",
      populate: {
        path: "customer",
        select: "firstName lastName email"
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit)
    .lean(),

  Shipment.countDocuments(filter),
]);

  return {
    shipments,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};
const getShipmentById = async (shipmentId) => {
  validateId(
    shipmentId,
    "Invalid shipment ID",
    "INVALID_SHIPMENT_ID"
  );

  const shipment = await Shipment.findById(
    shipmentId
  )
    .populate(
      "order",
      "orderNumber total status customer"
    )
    .lean();

  if (!shipment) {
    throw new ApiError(
      404,
      "Shipment not found",
      "SHIPMENT_NOT_FOUND"
    );
  }

  return shipment;
};

const getShipmentByOrder = async (orderId) => {
  validateId(
    orderId,
    "Invalid order ID",
    "INVALID_ORDER_ID"
  );

  const shipment = await Shipment.findOne({
    order: orderId,
  })
    .populate(
      "order",
      "orderNumber total status customer"
    )
    .lean();

  if (!shipment) {
    throw new ApiError(
      404,
      "Shipment not found for this order",
      "SHIPMENT_NOT_FOUND"
    );
  }

  return shipment;
};

const createShipment = async ({
  orderId,
  carrier,
  shippingCost = 0,
  expectedDelivery,
  shippingZone,
}) => {
  validateId(
    orderId,
    "Invalid order ID",
    "INVALID_ORDER_ID"
  );

  const order = await Order.findById(orderId).lean();

  if (!order) {
    throw new ApiError(
      404,
      "Order not found",
      "ORDER_NOT_FOUND"
    );
  }

  const existingShipment =
    await Shipment.findOne({
      order: orderId,
    }).lean();

  if (existingShipment) {
    throw new ApiError(
      409,
      "Shipment already exists for this order",
      "SHIPMENT_ALREADY_EXISTS"
    );
  }

  const normalizedShippingCost =
    Number(shippingCost);

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

  if (
    expectedDelivery &&
    Number.isNaN(Date.parse(expectedDelivery))
  ) {
    throw new ApiError(
      400,
      "Invalid expected delivery date",
      "INVALID_DELIVERY_DATE"
    );
  }

  const shipment = await Shipment.create({
    order: order._id,

    carrier: carrier?.trim() || "Standard",

    trackingId: generateTrackingId(),

    shippingCost: normalizedShippingCost,

    shippingZone: shippingZone?.trim() || "",

    expectedDelivery: expectedDelivery
      ? new Date(expectedDelivery)
      : undefined,

    status: "Processing",

    shippedAt: null,

    deliveredAt: null,
  });

  return Shipment.findById(shipment._id)
    .populate(
      "order",
      "orderNumber total status customer"
    )
    .lean();
};

const updateShipment = async (
  shipmentId,
  updateData
) => {
  validateId(
    shipmentId,
    "Invalid shipment ID",
    "INVALID_SHIPMENT_ID"
  );

  const shipment =
    await Shipment.findByIdAndUpdate(
      shipmentId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "order",
        "orderNumber total status customer"
      )
      .lean();

  if (!shipment) {
    throw new ApiError(
      404,
      "Shipment not found",
      "SHIPMENT_NOT_FOUND"
    );
  }

  return shipment;
};

const updateShipmentStatus = async (
  shipmentId,
  status
) => {
  validateId(
    shipmentId,
    "Invalid shipment ID",
    "INVALID_SHIPMENT_ID"
  );

  if (
    !VALID_SHIPMENT_STATUSES.includes(status)
  ) {
    throw new ApiError(
      400,
      "Invalid shipment status",
      "INVALID_SHIPMENT_STATUS"
    );
  }

  const updateData = {
    status,
  };

  if (status === "In Transit") {
    updateData.shippedAt = new Date();
  }

  if (status === "Delivered") {
    updateData.deliveredAt = new Date();
  }

  const shipment =
    await Shipment.findByIdAndUpdate(
      shipmentId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "order",
        "orderNumber total status customer"
      )
      .lean();

  if (!shipment) {
    throw new ApiError(
      404,
      "Shipment not found",
      "SHIPMENT_NOT_FOUND"
    );
  }

  /*
   * Synchronize order status.
   */
  if (shipment.order?._id) {
    let orderStatus;

    switch (status) {
      case "Processing":
        orderStatus = "Processing";
        break;

      case "In Transit":
        orderStatus = "Shipped";
        break;

      case "Delivered":
        orderStatus = "Delivered";
        break;

      case "Cancelled":
        orderStatus = "Cancelled";
        break;

      default:
        break;
    }

    if (orderStatus) {
      await Order.findByIdAndUpdate(
        shipment.order._id,
        {
          status: orderStatus,
        },
        {
          runValidators: true,
        }
      );
    }
  }

  return shipment;
};

const deleteShipment = async (shipmentId) => {
  validateId(
    shipmentId,
    "Invalid shipment ID",
    "INVALID_SHIPMENT_ID"
  );

  const shipment =
    await Shipment.findByIdAndDelete(
      shipmentId
    );

  if (!shipment) {
    throw new ApiError(
      404,
      "Shipment not found",
      "SHIPMENT_NOT_FOUND"
    );
  }

  return shipment.toObject();
};

module.exports = {
  getShipments,
  getShipmentById,
  getShipmentByOrder,
  createShipment,
  updateShipment,
  updateShipmentStatus,
  deleteShipment,
  VALID_SHIPMENT_STATUSES,
};