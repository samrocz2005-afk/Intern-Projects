// models/Book.js

import mongoose from "mongoose";


const bookSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },


    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },


    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },


    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [
        10,
        "Description must be at least 10 characters",
      ],
      maxlength: [
        500,
        "Description cannot exceed 500 characters",
      ],
    },


    publishedYear: {
      type: Number,
      required: [true, "Published year is required"],
      min: 1000,
      max: new Date().getFullYear(),
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



const Book = mongoose.model(
  "Book",
  bookSchema
);


export default Book;