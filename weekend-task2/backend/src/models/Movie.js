import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    source: { type: String, default: "" },
    value: { type: String, default: "" },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    omdbId: {
      type: String,
      unique: true,
      sparse: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: String,
      required: true,
    },

    rated: {
      type: String,
      default: "N/A",
    },

    released: {
      type: String,
      default: "N/A",
    },

    runtime: {
      type: String,
      default: "N/A",
    },

    language: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: "",
    },

    genre: {
      type: String,
      default: "",
    },

    director: {
      type: String,
      default: "N/A",
    },

    writer: {
      type: String,
      default: "N/A",
    },

    actors: {
      type: String,
      default: "",
    },

    hero: {
      type: String,
      default: "",
    },

    heroine: {
      type: String,
      default: "",
    },

    plot: {
      type: String,
      default: "",
    },

    awards: {
      type: String,
      default: "N/A",
    },

    poster: {
      type: String,
      default: "",
    },

    ratings: [ratingSchema],

    metascore: {
      type: String,
      default: "N/A",
    },

    imdbRating: {
      type: String,
      default: "N/A",
    },

    imdbVotes: {
      type: String,
      default: "N/A",
    },

    type: {
      type: String,
      default: "movie",
    },

    boxOffice: {
      type: String,
      default: "N/A",
    },

    production: {
      type: String,
      default: "N/A",
    },

    website: {
      type: String,
      default: "N/A",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Movie", movieSchema);