const mongoose = require("mongoose");

const routerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Router name is required"],
      trim: true,
      minlength: [2, "Router name must be at least 2 characters"],
      maxlength: [50, "Router name cannot exceed 50 characters"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Router owner is required"],
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    status: {
      type: String,
      enum: ["active", "inactive", "error"],
      default: "active",
      index: true,
    },

    networks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Network",
      },
    ],

    externalNetwork: {
      type: String,
      default: null,
      trim: true,
    },

    gatewayIp: {
      type: String,
      default: null,
      trim: true,
    },

    enableNat: {
      type: Boolean,
      default: true,
    },

    hourlyPrice: {
      type: Number,
      required: [true, "Router hourly price is required"],
      min: [0, "Hourly price cannot be negative"],
    },

    totalCost: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

routerSchema.index({
  owner: 1,
  status: 1,
});

module.exports = mongoose.model("Router", routerSchema);