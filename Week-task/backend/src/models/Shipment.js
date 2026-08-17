const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema(
  {
    shipmentNumber: {
      type: String,
      required: [true, "Shipment number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
      unique: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },

    carrier: {
      type: String,
      required: [true, "Shipping carrier is required"],
      trim: true,
      maxlength: [100, "Carrier name cannot exceed 100 characters"],
    },

    trackingId: {
      type: String,
      trim: true,
      maxlength: [100, "Tracking ID cannot exceed 100 characters"],
      default: "",
      index: true,
    },

    shippingCost: {
      type: Number,
      required: [true, "Shipping cost is required"],
      min: [0, "Shipping cost cannot be negative"],
      default: 0,
    },

    status: {
      type: String,
      enum: {
        values: [
          "Processing",
          "In Transit",
          "Delivered",
          "Delayed",
          "Cancelled",
        ],
        message: "Invalid shipment status",
      },
      default: "Processing",
      index: true,
    },

    expectedDelivery: {
      type: Date,
      default: null,
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    shippingAddress: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine2: {
        type: String,
        trim: true,
        default: "",
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      postalCode: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        default: "India",
        trim: true,
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

shipmentSchema.index({
  customer: 1,
  createdAt: -1,
});

shipmentSchema.index({
  status: 1,
  createdAt: -1,
});

shipmentSchema.index({
  carrier: 1,
  trackingId: 1,
});

module.exports = mongoose.model(
  "Shipment",
  shipmentSchema
);