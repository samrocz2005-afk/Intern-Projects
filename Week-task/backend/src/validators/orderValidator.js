const mongoose = require("mongoose");

const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const PAYMENT_METHODS = [
  "Cash on Delivery",
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
  "Mock Payment",
];

const validateObjectId = (value) => {
  return (
    typeof value === "string" &&
    mongoose.Types.ObjectId.isValid(value)
  );
};

const validateOrderData = (data) => {
  const errors = [];
  const value = {};

  // Root-level subtotal validation
  const subtotal = Number(data.subtotal);
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    errors.push({
      field: "subtotal",
      message: "Subtotal is required",
    });
  } else {
    value.subtotal = Number(subtotal.toFixed(2));
  }

  // Root-level total validation
  const total = Number(data.total !== undefined ? data.total : subtotal);
  if (!Number.isFinite(total) || total < 0) {
    value.total = value.subtotal;
  } else {
    value.total = Number(total.toFixed(2));
  }

  // Discount & Shipping
  value.discount = Number(data.discount || 0);
  value.shippingCost = Number(data.shippingCost || 0);

  if (!validateObjectId(data.customer)) {
    errors.push({
      field: "customer",
      message: "Valid customer ID is required",
    });
  } else {
    value.customer = data.customer;
  }

  if (
    !Array.isArray(data.items) ||
    data.items.length === 0
  ) {
    errors.push({
      field: "items",
      message: "Order must contain at least one item",
    });
  } else if (data.items.length > 100) {
    errors.push({
      field: "items",
      message: "An order cannot contain more than 100 items",
    });
  } else {
    value.items = [];

    data.items.forEach((item, index) => {
      if (!validateObjectId(item.product)) {
        errors.push({
          field: `items[${index}].product`,
          message: "Valid product ID is required",
        });
      }

      if (!item.name || typeof item.name !== "string" || item.name.trim() === "") {
        errors.push({
          field: `items[${index}].name`,
          message: "Product name is required",
        });
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        errors.push({
          field: `items[${index}].quantity`,
          message: "Quantity must be a positive whole number",
        });
      }

      const price = Number(item.price);
      if (!Number.isFinite(price) || price < 0) {
        errors.push({
          field: `items[${index}].price`,
          message: "Item price must be a valid non-negative number",
        });
      }

      const itemSubtotal = Number(item.subtotal !== undefined ? item.subtotal : (quantity * price));
      if (!Number.isFinite(itemSubtotal) || itemSubtotal < 0) {
        errors.push({
          field: `items[${index}].subtotal`,
          message: "Subtotal is required",
        });
      }

      if (validateObjectId(item.product) && Number.isInteger(quantity) && quantity > 0 && Number.isFinite(price) && price >= 0) {
        value.items.push({
          product: item.product,
          name: item.name ? item.name.trim() : "Item",
          quantity,
          price: Number(price.toFixed(2)),
          subtotal: Number(itemSubtotal.toFixed(2)),
        });
      }
    });
  }

  if (data.paymentMethod !== undefined) {
    if (!PAYMENT_METHODS.includes(data.paymentMethod)) {
      errors.push({
        field: "paymentMethod",
        message: `Payment method must be one of: ${PAYMENT_METHODS.join(", ")}`,
      });
    } else {
      value.paymentMethod = data.paymentMethod;
    }
  }

  if (data.shippingAddress !== undefined) {
    if (
      typeof data.shippingAddress !== "object" ||
      data.shippingAddress === null ||
      Array.isArray(data.shippingAddress)
    ) {
      errors.push({
        field: "shippingAddress",
        message: "Shipping address must be an object",
      });
    } else {
      value.shippingAddress = data.shippingAddress;
    }
  }

  return {
    value: {
      body: value,
    },
    errors,
  };
};

const createOrderValidator = ({ body }) => {
  return validateOrderData(body);
};

const updateOrderValidator = ({ body }) => {
  const errors = [];
  const value = {};

  if (!body || Object.keys(body).length === 0) {
    return {
      value: { body: {} },
      errors: [{ field: "body", message: "At least one field is required for update" }],
    };
  }

  if (body.status !== undefined) {
    if (!ORDER_STATUSES.includes(body.status)) {
      errors.push({ field: "status", message: `Status must be one of: ${ORDER_STATUSES.join(", ")}` });
    } else {
      value.status = body.status;
    }
  }

  if (body.paymentMethod !== undefined) {
    if (!PAYMENT_METHODS.includes(body.paymentMethod)) {
      errors.push({ field: "paymentMethod", message: `Payment method must be one of: ${PAYMENT_METHODS.join(", ")}` });
    } else {
      value.paymentMethod = body.paymentMethod;
    }
  }

  if (body.shippingAddress !== undefined) {
    if (typeof body.shippingAddress !== "object" || body.shippingAddress === null || Array.isArray(body.shippingAddress)) {
      errors.push({ field: "shippingAddress", message: "Shipping address must be an object" });
    } else {
      value.shippingAddress = body.shippingAddress;
    }
  }

  return {
    value: { body: value },
    errors,
  };
};

const updateOrderStatusValidator = ({ body }) => {
  const errors = [];
  const value = {};

  if (!ORDER_STATUSES.includes(body.status)) {
    errors.push({ field: "status", message: `Status must be one of: ${ORDER_STATUSES.join(", ")}` });
  } else {
    value.status = body.status;
  }

  return {
    value: { body: value },
    errors,
  };
};

module.exports = {
  createOrderValidator,
  updateOrderValidator,
  updateOrderStatusValidator,
  ORDER_STATUSES,
  PAYMENT_METHODS,
};