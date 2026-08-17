const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [150, "Product name cannot exceed 150 characters"],
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [2, "SKU must be at least 2 characters"],
      maxlength: [50, "SKU cannot exceed 50 characters"],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    image: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive", "Draft"],
        message: "Invalid product status",
      },
      default: "Active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: "text",
  sku: "text",
});

productSchema.index({
  category: 1,
  status: 1,
});

productSchema.index({
  createdAt: -1,
});

module.exports = mongoose.model("Product", productSchema);