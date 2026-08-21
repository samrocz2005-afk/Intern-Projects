const mongoose = require("mongoose");

const flavorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Flavor name is required"],
      unique: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    vcpus: {
      type: Number,
      required: [true, "VCPU count is required"],
      min: [1, "VCPU must be at least 1"],
    },

    ram: {
      type: Number,
      required: [true, "RAM is required"],
      min: [1, "RAM must be at least 1 GB"],
    },

    disk: {
      type: Number,
      required: [true, "Disk size is required"],
      min: [1, "Disk must be at least 1 GB"],
    },

    hourlyPrice: {
      type: Number,
      required: [true, "Hourly price is required"],
      min: [0, "Hourly price cannot be negative"],
    },

    monthlyPrice: {
      type: Number,
      default: null,
      min: [0, "Monthly price cannot be negative"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Flavor", flavorSchema);