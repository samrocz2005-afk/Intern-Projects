const mongoose = require("mongoose");

const usageRecordSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Usage owner is required"],
      index: true,
    },

    resourceType: {
      type: String,
      enum: [
        "instance",
        "storage",
        "router",
        "load_balancer",
      ],
      required: [true, "Resource type is required"],
      index: true,
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Resource reference is required"],
      refPath: "resourceTypeModel",
    },

    // Mongoose model name used by refPath
    resourceTypeModel: {
      type: String,
      enum: [
        "Instance",
        "Storage",
        "Router",
        "LoadBalancer",
      ],
      required: true,
    },

    usageStart: {
      type: Date,
      required: [true, "Usage start time is required"],
    },

    usageEnd: {
      type: Date,
      required: [true, "Usage end time is required"],
    },

    durationSeconds: {
      type: Number,
      required: true,
      min: 0,
    },

    durationHours: {
      type: Number,
      required: true,
      min: 0,
    },

    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: 0,
    },

    amount: {
      type: Number,
      required: [true, "Usage amount is required"],
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    billingType: {
      type: String,
      enum: ["hourly", "monthly", "usage"],
      default: "hourly",
    },

    status: {
      type: String,
      enum: ["pending", "billed", "cancelled"],
      default: "pending",
      index: true,
    },

    billing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billing",
      default: null,
    },

    billingPeriodStart: {
      type: Date,
      required: true,
    },

    billingPeriodEnd: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate usage records for the same resource/time period
usageRecordSchema.index(
  {
    resource: 1,
    usageStart: 1,
    usageEnd: 1,
  },
  {
    unique: true,
  }
);

usageRecordSchema.index({
  owner: 1,
  billingPeriodStart: 1,
  billingPeriodEnd: 1,
});

module.exports = mongoose.model("UsageRecord", usageRecordSchema);