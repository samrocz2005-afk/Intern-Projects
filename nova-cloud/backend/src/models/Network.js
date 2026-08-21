const mongoose = require("mongoose");

const networkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Network name is required"],
      trim: true,
      minlength: [2, "Network name must be at least 2 characters"],
      maxlength: [50, "Network name cannot exceed 50 characters"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Network owner is required"],
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    cidr: {
      type: String,
      required: [true, "CIDR is required"],
      trim: true,
      match: [
        /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\/(?:[0-9]|[1-2][0-9]|3[0-2])$/,
        "Please provide a valid IPv4 CIDR",
      ],
    },

    gateway: {
      type: String,
      trim: true,
      default: null,
    },

    dnsServers: [
      {
        type: String,
        trim: true,
      },
    ],

    type: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "error"],
      default: "active",
      index: true,
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

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

networkSchema.index({
  owner: 1,
  status: 1,
});

module.exports = mongoose.model("Network", networkSchema);