const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vendor name is required"],
      trim: true,
      minlength: [2, "Vendor name must be at least 2 characters"],
      maxlength: [150, "Vendor name cannot exceed 150 characters"],
    },

    email: {
      type: String,
      required: [true, "Vendor email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [150, "Vendor email cannot exceed 150 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid vendor email",
      ],
    },

    phone: {
      type: String,
      trim: true,
      match: [
        /^[+]?[0-9\s()-]{7,20}$/,
        "Please provide a valid vendor phone number",
      ],
    },

    companyName: {
      type: String,
      trim: true,
      maxlength: [200, "Company name cannot exceed 200 characters"],
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

    commissionRate: {
      type: Number,
      min: [0, "Commission rate cannot be negative"],
      max: [100, "Commission rate cannot exceed 100"],
      default: 0,
    },

    status: {
      type: String,
      enum: {
        values: [
          "Pending",
          "Approved",
          "Rejected",
          "Suspended",
          "Inactive",
        ],
        message: "Invalid vendor status",
      },
      default: "Pending",
      index: true,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

vendorSchema.index({
  name: "text",
  companyName: "text",
  email: "text",
});

vendorSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Vendor", vendorSchema);