const mongoose = require("mongoose");

const instanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Instance name is required"],
      trim: true,
      minlength: [2, "Instance name must be at least 2 characters"],
      maxlength: [50, "Instance name cannot exceed 50 characters"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instance owner is required"],
      index: true,
    },

    flavor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flavor",
      required: [true, "Flavor is required"],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "running",
        "stopped",
        "restarting",
        "terminated",
        "error",
      ],
      default: "pending",
      index: true,
    },

    ipAddress: {
      type: String,
      default: null,
      trim: true,
    },

    privateIpAddress: {
      type: String,
      default: null,
      trim: true,
    },

    operatingSystem: {
      type: String,
      required: [true, "Operating system is required"],
      trim: true,
    },

    network: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Network",
      default: null,
    },

    sshKeyName: {
      type: String,
      default: null,
      trim: true,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    stoppedAt: {
      type: Date,
      default: null,
    },

    terminatedAt: {
      type: Date,
      default: null,
    },

    totalRunningSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentSessionStartedAt: {
      type: Date,
      default: null,
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

// Useful compound index for ownership queries
instanceSchema.index({
  owner: 1,
  status: 1,
});

// Calculate current running duration
instanceSchema.methods.getRunningSeconds = function () {
  if (
    this.status !== "running" ||
    !this.currentSessionStartedAt
  ) {
    return this.totalRunningSeconds;
  }

  const currentSession =
    (Date.now() - this.currentSessionStartedAt.getTime()) / 1000;

  return this.totalRunningSeconds + currentSession;
};

module.exports = mongoose.model("Instance", instanceSchema);