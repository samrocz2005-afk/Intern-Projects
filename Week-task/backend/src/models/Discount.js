const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Discount name is required"],
      trim: true,
      minlength: [2, "Discount name must be at least 2 characters"],
      maxlength: [100, "Discount name cannot exceed 100 characters"],
    },

    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [3, "Coupon code must be at least 3 characters"],
      maxlength: [50, "Coupon code cannot exceed 50 characters"],
    },

    type: {
      type: String,
      enum: {
        values: ["Percentage", "Fixed"],
        message: "Discount type must be Percentage or Fixed",
      },
      required: [true, "Discount type is required"],
    },

    value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },

    minimumOrderValue: {
      type: Number,
      min: [0, "Minimum order value cannot be negative"],
      default: 0,
    },

    maximumDiscount: {
      type: Number,
      min: [0, "Maximum discount cannot be negative"],
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

    usageLimit: {
      type: Number,
      min: [1, "Usage limit must be at least 1"],
      default: null,
    },

    usedCount: {
      type: Number,
      min: [0, "Used count cannot be negative"],
      default: 0,
    },

    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive"],
        message: "Invalid discount status",
      },
      default: "Active",
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Validate percentage discount.
 */
discountSchema.pre("validate", function (next) {
  if (this.type === "Percentage" && this.value > 100) {
    this.invalidate(
      "value",
      "Percentage discount cannot exceed 100"
    );
  }

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

  if (
    this.usageLimit !== null &&
    this.usedCount > this.usageLimit
  ) {
    this.invalidate(
      "usedCount",
      "Used count cannot exceed usage limit"
    );
  }

  next();
});

discountSchema.index({
  code: 1,
});

discountSchema.index({
  status: 1,
  startDate: 1,
  endDate: 1,
});

discountSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model("Discount", discountSchema);