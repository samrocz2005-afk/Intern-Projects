const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Notification recipient is required"],
      index: true,
    },

    recipientModel: {
      type: String,
      enum: {
        values: ["Customer", "Staff"],
        message: "Invalid notification recipient type",
      },
      required: [true, "Notification recipient type is required"],
      index: true,
    },

    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    type: {
      type: String,
      enum: {
        values: [
          "Info",
          "Success",
          "Warning",
          "Error",
          "Order",
          "Inventory",
          "Payment",
          "System",
        ],
        message: "Invalid notification type",
      },
      default: "Info",
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },

    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    resourceType: {
      type: String,
      trim: true,
      maxlength: [100, "Resource type cannot exceed 100 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({
  recipient: 1,
  recipientModel: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  recipientModel: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);