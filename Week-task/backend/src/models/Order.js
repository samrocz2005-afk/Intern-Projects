const mongoose = require("mongoose");

// Ensure Customer model is registered in memory for Mongoose population
require("./Customer");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: [true, "Order number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: [true, "Order items are required"],
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },

    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },

    shippingCost: {
      type: Number,
      default: 0,
      min: [0, "Shipping cost cannot be negative"],
    },

    total: {
      type: Number,
      required: [true, "Order total is required"],
      min: [0, "Order total cannot be negative"],
    },

    status: {
      type: String,
      enum: {
        values: [
          "Pending",
          "Processing",
          "Completed",
          "Cancelled",
          "Refunded",
        ],
        message: "Invalid order status",
      },
      default: "Pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: {
        values: [
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
          "Partially Refunded",
        ],
        message: "Invalid payment status",
      },
      default: "Pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: {
        values: [
          "Cash",
          "Card",
          "UPI",
          "Net Banking",
          "Mock Payment",
        ],
        message: "Invalid payment method",
      },
      default: "Mock Payment",
    },

    shippingAddress: {
      name: {
        type: String,
        trim: true,
        required: true,
      },

      phone: {
        type: String,
        trim: true,
        required: true,
      },

      addressLine1: {
        type: String,
        trim: true,
        required: true,
      },

      addressLine2: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        trim: true,
        required: true,
      },

      state: {
        type: String,
        trim: true,
        required: true,
      },

      postalCode: {
        type: String,
        trim: true,
        required: true,
      },

      country: {
        type: String,
        trim: true,
        default: "India",
      },
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({
  customer: 1,
  createdAt: -1,
});

orderSchema.index({
  status: 1,
  createdAt: -1,
});

orderSchema.index({
  paymentStatus: 1,
});

orderSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model("Order", orderSchema);