const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "User is required"],
      index: true,
    },

    action: {
      type: String,
      required: [true, "Action is required"],
      trim: true,
      uppercase: true,
      maxlength: [100, "Action cannot exceed 100 characters"],
      index: true,
    },

    module: {
      type: String,
      required: [true, "Module is required"],
      trim: true,
      maxlength: [100, "Module cannot exceed 100 characters"],
      index: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    resourceType: {
      type: String,
      trim: true,
      maxlength: [100, "Resource type cannot exceed 100 characters"],
      default: "",
    },

    ipAddress: {
      type: String,
      trim: true,
      maxlength: [100, "IP address cannot exceed 100 characters"],
      default: "",
    },

    userAgent: {
      type: String,
      trim: true,
      maxlength: [1000, "User agent cannot exceed 1000 characters"],
      default: "",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({
  user: 1,
  createdAt: -1,
});

activityLogSchema.index({
  module: 1,
  action: 1,
  createdAt: -1,
});

activityLogSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model(
  "ActivityLog",
  activityLogSchema
);