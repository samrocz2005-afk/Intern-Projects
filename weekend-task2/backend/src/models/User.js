import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: [String],
      enum: [
        "Admin",
        "Member",
        "Reader",
        "Movie Create",
        "Movie Read",
        "Movie Update",
        "Movie Delete",
        "Cinema Create",
        "Cinema Read",
        "Cinema Update",
        "Cinema Delete",
      ],
      default: ["Reader"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);