const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive"],
        message: "Invalid category status",
      },
      default: "Active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({
  name: "text",
});

categorySchema.index({
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Category", categorySchema);