const mongoose = require("mongoose");

const integrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Integration name is required"],
      trim: true,
      minlength: [2, "Integration name must be at least 2 characters"],
      maxlength: [100, "Integration name cannot exceed 100 characters"],
    },

    type: {
      type: String,
      enum: {
        values: [
          "Shipping API",
          "CRM",
          "Social Media",
          "Email Service",
          "Other",
        ],
        message: "Invalid integration type",
      },
      required: [true, "Integration type is required"],
      index: true,
    },

    provider: {
      type: String,
      required: [true, "Integration provider is required"],
      trim: true,
      maxlength: [100, "Provider name cannot exceed 100 characters"],
    },

    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive", "Error"],
        message: "Invalid integration status",
      },
      default: "Inactive",
      index: true,
    },

    configuration: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    lastSyncAt: {
      type: Date,
      default: null,
    },

    lastError: {
      type: String,
      trim: true,
      maxlength: [1000, "Error message cannot exceed 1000 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

integrationSchema.index({
  type: 1,
  status: 1,
});

integrationSchema.index({
  provider: 1,
});

module.exports = mongoose.model(
  "Integration",
  integrationSchema
);