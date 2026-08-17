const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
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

    amount: {
      type: Number,
      required: [true, "Transaction amount is required"],
      min: [0, "Transaction amount cannot be negative"],
    },

    currency: {
      type: String,
      trim: true,
      uppercase: true,
      default: "INR",
      maxlength: 3,
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

    paymentStatus: {
      type: String,
      enum: {
        values: [
          "Pending",
          "Processing",
          "Completed",
          "Failed",
          "Cancelled",
        ],
        message: "Invalid payment status",
      },
      default: "Pending",
      index: true,
    },

    refundStatus: {
      type: String,
      enum: {
        values: [
          "Not Requested",
          "Pending",
          "Processing",
          "Completed",
          "Failed",
        ],
        message: "Invalid refund status",
      },
      default: "Not Requested",
      index: true,
    },

    refundedAmount: {
      type: Number,
      min: [0, "Refunded amount cannot be negative"],
      default: 0,
    },

    gatewayReference: {
      type: String,
      trim: true,
      default: "",
    },

    metadata: {
      type: Map,
      of: String,
      default: {},
    },

    processedAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({
  order: 1,
  createdAt: -1,
});

transactionSchema.index({
  customer: 1,
  createdAt: -1,
});

transactionSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Transaction",
  transactionSchema
);