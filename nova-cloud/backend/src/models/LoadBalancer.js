const mongoose = require("mongoose");

const backendSchema = new mongoose.Schema(
  {
    instance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instance",
      required: true,
    },

    port: {
      type: Number,
      required: true,
      min: 1,
      max: 65535,
    },

    weight: {
      type: Number,
      default: 1,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    healthStatus: {
      type: String,
      enum: ["healthy", "unhealthy", "unknown"],
      default: "unknown",
    },
  },
  { _id: true }
);

const loadBalancerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Load balancer name is required"],
      trim: true,
      minlength: [2, "Load balancer name must be at least 2 characters"],
      maxlength: [50, "Load balancer name cannot exceed 50 characters"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Load balancer owner is required"],
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
    },

    type: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    protocol: {
      type: String,
      enum: ["HTTP", "HTTPS", "TCP", "UDP"],
      default: "HTTP",
    },

    listenerPort: {
      type: Number,
      required: [true, "Listener port is required"],
      min: 1,
      max: 65535,
    },

    targetPort: {
      type: Number,
      required: [true, "Target port is required"],
      min: 1,
      max: 65535,
    },

    algorithm: {
      type: String,
      enum: ["round_robin", "least_connections", "ip_hash"],
      default: "round_robin",
    },

    backendInstances: [backendSchema],

    network: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Network",
      default: null,
    },

    ipAddress: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      enum: ["creating", "active", "inactive", "error", "deleting"],
      default: "creating",
      index: true,
    },

    hourlyPrice: {
      type: Number,
      required: [true, "Load balancer hourly price is required"],
      min: [0, "Hourly price cannot be negative"],
    },

    totalCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

loadBalancerSchema.index({
  owner: 1,
  status: 1,
});

module.exports = mongoose.model("LoadBalancer", loadBalancerSchema);