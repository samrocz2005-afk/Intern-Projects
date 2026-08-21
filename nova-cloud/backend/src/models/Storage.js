const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Storage name is required"],
      trim: true,
      minlength: [2, "Storage name must be at least 2 characters"],
      maxlength: [50, "Storage name cannot exceed 50 characters"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Storage owner is required"],
      index: true,
    },

    size: {
      type: Number,
      required: [true, "Storage size is required"],
      min: [1, "Storage size must be at least 1 GB"],
    },

    type: {
      type: String,
      enum: ["ssd", "hdd", "nvme"],
      default: "ssd",
    },

    status: {
      type: String,
      enum: [
        "creating",
        "available",
        "attaching",
        "attached",
        "detaching",
        "deleting",
        "error",
      ],
      default: "creating",
      index: true,
    },

    instance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instance",
      default: null,
      index: true,
    },

    mountPoint: {
      type: String,
      default: null,
      trim: true,
    },

    encrypted: {
      type: Boolean,
      default: true,
    },

    hourlyPrice: {
      type: Number,
      required: [true, "Storage hourly price is required"],
      min: [0, "Hourly price cannot be negative"],
    },

    totalCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    attachedAt: {
      type: Date,
      default: null,
    },

    detachedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

storageSchema.index({
  owner: 1,
  status: 1,
});

module.exports = mongoose.model("Storage", storageSchema);