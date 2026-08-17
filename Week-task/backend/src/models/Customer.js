const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [1, "Last name must be at least 1 character"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [150, "Email cannot exceed 150 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      match: [
        /^[+]?[0-9\s()-]{7,20}$/,
        "Please provide a valid phone number",
      ],
    },

    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive"],
        message: "Invalid customer status",
      },
      default: "Active",
      index: true,
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
  },
  {
    timestamps: true,
  }
);

customerSchema.index({
  firstName: "text",
  lastName: "text",
  email: "text",
});

customerSchema.index({
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Customer", customerSchema, "customers");