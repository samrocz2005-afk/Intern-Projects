const mongoose = require("mongoose");

const returnItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },

    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },

    reason: {
      type: String,
      required: [true, "Return reason is required"],
      trim: true,
      maxlength: [500, "Return reason cannot exceed 500 characters"],
    },
  },
  {
    _id: false,
  }
);

const returnSchema = new mongoose.Schema(
  {
    returnNumber: {
      type: String,
      required: [true, "Return number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },

    items: {
      type: [returnItemSchema],
      required: [true, "Return items are required"],
      validate: {
        validator: (items) => items.length > 0,
        message: "Return must contain at least one item",
      },
    },

    reason: {
      type: String,
      required: [true, "Return reason is required"],
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },

    status: {
      type: String,
      enum: {
        values: [
          "Requested",
          "Approved",
          "Rejected",
          "Received",
          "Refunded",
          "Exchanged",
          "Cancelled",
        ],
        message: "Invalid return status",
      },
      default: "Requested",
      index: true,
    },

    type: {
      type: String,
      enum: {
        values: ["Refund", "Exchange"],
        message: "Invalid return type",
      },
      default: "Refund",
    },

    refundAmount: {
      type: Number,
      min: [0, "Refund amount cannot be negative"],
      default: 0,
    },

    refundStatus: {
      type: String,
      enum: {
        values: [
          "Not Applicable",
          "Pending",
          "Processing",
          "Completed",
          "Failed",
        ],
        message: "Invalid refund status",
      },
      default: "Not Applicable",
    },

    exchangeProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    processedAt: {
      type: Date,
      default: null,
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

returnSchema.index({
  customer: 1,
  createdAt: -1,
});

returnSchema.index({
  order: 1,
  createdAt: -1,
});

returnSchema.index({
  status: 1,
  createdAt: -1,
});

returnSchema.index({
  refundStatus: 1,
});

module.exports = mongoose.model("Return", returnSchema);