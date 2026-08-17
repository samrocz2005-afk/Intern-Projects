import Movie from "../models/Movie.js";

// Get All Movies 
export const getAllMovies = async (search = "") => {
  if (!search.trim()) {
    return await Movie.find({}).sort({ createdAt: 1 });
  }

  return await Movie.find({
    $or: [
      { title: { $regex: search, $options: "i" } },
      { director: { $regex: search, $options: "i" } },
      { hero: { $regex: search, $options: "i" } },
      { actors: { $regex: search, $options: "i" } },
      { genre: { $regex: search, $options: "i" } },
    ],
  }).sort({ createdAt: -1 });
};

// Get One Movie
export const getMovieById = async (id) => {
  return await Movie.findById(id);
};


// Create Movie
export const createMovie = async (movieData) => {
  return await Movie.create(movieData);
};

// Update Movie
export const updateMovie = async (id, movieData) => {
  return await Movie.findByIdAndUpdate(id, movieData, {
    new: true,
    runValidators: true,
  });
};


// Delete Movie
export const deleteMovie = async (id) => {
  return await Movie.findByIdAndDelete(id);
};


// Bulk Upsert Movies 
export const importMovies = async (movies) => {
  if (!movies || movies.length === 0) return [];

  const operations = movies.map((movie) => ({
    updateOne: {
      filter: { omdbId: movie.omdbId },
      update: { $set: movie },
      upsert: true,
    },
  }));

  await Movie.bulkWrite(operations);

  const omdbIds = movies.map((m) => m.omdbId);
  return await Movie.find({ omdbId: { $in: omdbIds } });
};