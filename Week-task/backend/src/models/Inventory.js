const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      unique: true,
      index: true,
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    lowStockThreshold: {
      type: Number,
      required: [true, "Low-stock threshold is required"],
      min: [0, "Low-stock threshold cannot be negative"],
      default: 10,
    },

    reservedStock: {
      type: Number,
      min: [0, "Reserved stock cannot be negative"],
      default: 0,
    },

    warehouse: {
      type: String,
      trim: true,
      maxlength: [100, "Warehouse name cannot exceed 100 characters"],
      default: "Main Warehouse",
    },

    lastStockAdjustment: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Virtual available stock.
 *
 * Example:
 * stock = 100
 * reservedStock = 20
 * availableStock = 80
 */
inventorySchema.virtual("availableStock").get(function () {
  return Math.max(this.stock - this.reservedStock, 0);
});

/*
 * Useful for low-stock queries.
 */
inventorySchema.index({
  stock: 1,
});

inventorySchema.index({
  lowStockThreshold: 1,
});

inventorySchema.index({
  warehouse: 1,
});

module.exports = mongoose.model("Inventory", inventorySchema);