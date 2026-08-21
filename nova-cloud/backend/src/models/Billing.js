const mongoose = require("mongoose");

const billingItemSchema = new mongoose.Schema(
  {
    resourceType: {
      type: String,
      enum: [
        "instance",
        "storage",
        "router",
        "load_balancer",
      ],
      required: true,
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    resourceName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      enum: ["hour", "GB-hour", "month", "usage"],
      default: "hour",
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const billingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Billing user is required"],
      index: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    billingPeriodStart: {
      type: Date,
      required: [true, "Billing period start is required"],
    },

    billingPeriodEnd: {
      type: Date,
      required: [true, "Billing period end is required"],
    },

    items: [billingItemSchema],

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "paid",
        "failed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        "wallet",
        "card",
        "upi",
        "bank_transfer",
        "none",
      ],
      default: "none",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

billingSchema.index({
  user: 1,
  billingPeriodStart: -1,
});

module.exports = mongoose.model("Billing", billingSchema);