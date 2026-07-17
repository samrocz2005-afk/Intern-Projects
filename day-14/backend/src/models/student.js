const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: ["CSE", "IT", "ECE", "EEE", "MECH"],
        message: "Invalid department",
      },
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Age must be at least 18"],
      max: [60, "Age cannot be greater than 60"],
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },

    marks: {
      tamil: {
        type: Number,
        required: [true, "Tamil marks are required"],
        min: 0,
        max: 100,
      },

      english: {
        type: Number,
        required: [true, "English marks are required"],
        min: 0,
        max: 100,
      },

      maths: {
        type: Number,
        required: [true, "Maths marks are required"],
        min: 0,
        max: 100,
      },

      science: {
        type: Numbe,
        required: [true, "Science marks are required"],
        min: 0,
        max: 100,
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);