const mongoose = require("mongoose");

const supportMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: [true, "Message sender is required"],
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [5000, "Message cannot exceed 5000 characters"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true,
  }
);

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: [true, "Ticket number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
      index: true,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [3, "Subject must be at least 3 characters"],
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },

    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High", "Urgent"],
        message: "Invalid ticket priority",
      },
      default: "Medium",
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: [
          "Open",
          "In Progress",
          "Waiting for Customer",
          "Resolved",
          "Closed",
        ],
        message: "Invalid ticket status",
      },
      default: "Open",
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      default: null,
      index: true,
    },

    messages: {
      type: [supportMessageSchema],
      default: [],
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

supportTicketSchema.index({
  customer: 1,
  createdAt: -1,
});

supportTicketSchema.index({
  status: 1,
  priority: 1,
  createdAt: -1,
});

supportTicketSchema.index({
  assignedTo: 1,
  status: 1,
});

supportTicketSchema.index({
  subject: "text",
  description: "text",
});

module.exports = mongoose.model(
  "SupportTicket",
  supportTicketSchema
);