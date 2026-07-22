import mongoose from "mongoose";

const currentYear = new Date().getFullYear();

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      validate: {
        validator: (value) => /[A-Za-z]/.test(value),
        message: "Title must contain at least one letter",
      },
    },

    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      minlength: [2, "Author name must be at least 2 characters"],
      maxlength: [50, "Author name cannot exceed 50 characters"],
      match: [
        /^[A-Za-z\s.'-]+$/,
        "Author name can contain only letters, spaces, apostrophes (') and hyphens (-)",
      ],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: [2, "Category must be at least 2 characters"],
      maxlength: [50, "Category cannot exceed 50 characters"],
      match: [
        /^[A-Za-z\s]+$/,
        "Category can contain only letters and spaces",
      ],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      min: [1000, "Published year cannot be less than 1000"],
      max: [
        currentYear,
        `Published year cannot be greater than ${currentYear}`,
      ],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;