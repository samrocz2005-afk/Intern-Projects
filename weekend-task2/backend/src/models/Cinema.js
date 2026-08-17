import mongoose from "mongoose";

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cinema name is required"],
      trim: true,
      maxlength: 100,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: 200,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: 50,
    },

    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
      maxlength: 50,
    },

    screens: {
      type: Number,
      required: [true, "Number of screens is required"],
      min: [1, "Screens must be at least 1"],
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Contact number must be 10 digits"],
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate cinema with same name in same city
cinemaSchema.index({ name: 1, city: 1 }, { unique: true });

export default mongoose.model("Cinema", cinemaSchema);