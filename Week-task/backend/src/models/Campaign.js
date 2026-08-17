const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      trim: true,
      minlength: [2, "Campaign name must be at least 2 characters"],
      maxlength: [150, "Campaign name cannot exceed 150 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },

    type: {
      type: String,
      enum: {
        values: [
          "Discount",
          "Promotion",
          "Seasonal",
          "Email",
          "Social Media",
        ],
        message: "Invalid campaign type",
      },
      required: [true, "Campaign type is required"],
    },

    discount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
      default: null,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    status: {
      type: String,
      enum: {
        values: [
          "Draft",
          "Scheduled",
          "Active",
          "Paused",
          "Completed",
          "Cancelled",
        ],
        message: "Invalid campaign status",
      },
      default: "Draft",
      index: true,
    },

    budget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
      default: 0,
    },

    targetAudience: {
      type: String,
      trim: true,
      maxlength: [200, "Target audience cannot exceed 200 characters"],
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.pre("validate", function (next) {
  if (
    this.endDate &&
    this.startDate &&
    this.endDate <= this.startDate
  ) {
    this.invalidate(
      "endDate",
      "End date must be after start date"
    );
  }

  next();
});

campaignSchema.index({
  status: 1,
  startDate: 1,
  endDate: 1,
});

campaignSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model(
  "Campaign",
  campaignSchema
);