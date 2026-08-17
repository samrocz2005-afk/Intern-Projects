const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating must be a whole number",
      },
    },

    title: {
      type: String,
      trim: true,
      maxlength: [150, "Review title cannot exceed 150 characters"],
      default: "",
    },

    comment: {
      type: String,
      trim: true,
      maxlength: [2000, "Review cannot exceed 2000 characters"],
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["Pending", "Approved", "Rejected"],
        message: "Invalid review status",
      },
      default: "Pending",
      index: true,
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({
  product: 1,
  status: 1,
  createdAt: -1,
});

reviewSchema.index({
  rating: 1,
  status: 1,
});

reviewSchema.index({
  customer: 1,
  createdAt: -1,
});

reviewSchema.index({
  comment: "text",
  title: "text",
});

module.exports = mongoose.model("Review", reviewSchema);