const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, "Settings key is required"],
      unique: true,
      trim: true,
      default: "global",
      index: true,
    },

    store: {
      name: {
        type: String,
        trim: true,
        maxlength: [150, "Store name cannot exceed 150 characters"],
        default: "",
      },

      email: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [150, "Store email cannot exceed 150 characters"],
        match: [
          /^$|^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          "Please provide a valid store email",
        ],
        default: "",
      },

      phone: {
        type: String,
        trim: true,
        maxlength: [30, "Store phone cannot exceed 30 characters"],
        default: "",
      },

      address: {
        addressLine1: {
          type: String,
          trim: true,
          default: "",
        },

        addressLine2: {
          type: String,
          trim: true,
          default: "",
        },

        city: {
          type: String,
          trim: true,
          default: "",
        },

        state: {
          type: String,
          trim: true,
          default: "",
        },

        postalCode: {
          type: String,
          trim: true,
          default: "",
        },

        country: {
          type: String,
          trim: true,
          default: "India",
        },
      },

      currency: {
        type: String,
        trim: true,
        uppercase: true,
        maxlength: 3,
        default: "INR",
      },

      timezone: {
        type: String,
        trim: true,
        default: "Asia/Kolkata",
      },
    },

    general: {
      maintenanceMode: {
        type: Boolean,
        default: false,
      },

      allowGuestCheckout: {
        type: Boolean,
        default: true,
      },

      lowStockThreshold: {
        type: Number,
        min: [0, "Low-stock threshold cannot be negative"],
        default: 10,
      },

      defaultPageSize: {
        type: Number,
        min: [1, "Default page size must be at least 1"],
        max: [100, "Default page size cannot exceed 100"],
        default: 10,
      },
    },

    profile: {
      logo: {
        type: String,
        trim: true,
        default: "",
      },

      website: {
        type: String,
        trim: true,
        default: "",
      },

      description: {
        type: String,
        trim: true,
        maxlength: [1000, "Store description cannot exceed 1000 characters"],
        default: "",
      },
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);