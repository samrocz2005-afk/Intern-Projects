import axios from "axios";
import {
  getAllMovies as getAllMoviesFromDb,
  getMovieById,
  createMovie as createMovieService,
  updateMovie as updateMovieService,
  deleteMovie as deleteMovieService,
  importMovies,
} from "../services/movieService.js";

const formatOmdbData = (data) => ({
  omdbId: data.imdbID,
  title: data.Title,
  year: data.Year,
  rated: data.Rated || "N/A",
  released: data.Released || "N/A",
  runtime: data.Runtime || "N/A",
  genre: data.Genre || "",
  director: data.Director || "N/A",
  writer: data.Writer || "N/A",
  actors: data.Actors || "",
  hero: data.Actors || "",
  heroine: "",
  plot: data.Plot || "",
  language: data.Language || "English",
  country: data.Country || "",
  awards: data.Awards || "N/A",
  poster: data.Poster !== "N/A" ? data.Poster : "",
  ratings: Array.isArray(data.Ratings)
    ? data.Ratings.map((r) => ({ source: r.Source, value: r.Value }))
    : [],
  metascore: data.Metascore || "N/A",
  imdbRating: data.imdbRating || "N/A",
  imdbVotes: data.imdbVotes || "N/A",
  type: data.Type || "movie",
  boxOffice: data.BoxOffice || "N/A",
  production: data.Production || "N/A",
  website: data.Website || "N/A",
});

// Helper to remove duplicate movie objects based on omdbId before importing
const removeDuplicates = (movies) => {
  const seen = new Set();
  return movies.filter((item) => {
    if (!item.omdbId || seen.has(item.omdbId)) return false;
    seen.add(item.omdbId);
    return true;
  });
};

// Main Controller: Get Movies (from DB or seed/search via OMDb)
export const getMovies = async (req, res) => {
  try {
    const { search = "" } = req.query;

    let movies = await getAllMoviesFromDb(search);

    // Case 1: Initial load when DB is completely empty
    if (movies.length === 0 && !search.trim()) {
      const defaultMovies = [
        "Avengers", "Batman", "Inception", "Interstellar", "Titanic",
        "Avatar", "Joker", "Iron Man", "The Dark Knight", "Spider-Man"
      ];

      const fetchPromises = defaultMovies.map(async (keyword) => {
        const searchRes = await axios.get(
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${keyword}`
        );
        const results = searchRes.data.Search || [];
        
        return Promise.all(
          results.slice(0, 3).map(async (item) => {
            const detailRes = await axios.get(
              `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${item.imdbID}`
            );
            return detailRes.data?.Response !== "False" ? formatOmdbData(detailRes.data) : null;
          })
        );
      });

      const nestedResults = await Promise.all(fetchPromises);
      const movieList = removeDuplicates(nestedResults.flat().filter(Boolean));

      if (movieList.length > 0) {
        await importMovies(movieList);
        movies = await getAllMoviesFromDb("");
      }
    } 
    // Case 2: Search term not found in MongoDB -> Fetch from OMDb
    else if (movies.length === 0 && search.trim()) {
      const searchRes = await axios.get(
        `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(search.trim())}`
      );
      const results = searchRes.data.Search || [];

      if (results.length > 0) {
        const detailPromises = results.slice(0, 5).map(async (item) => {
          const detailRes = await axios.get(
            `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${item.imdbID}`
          );
          return detailRes.data?.Response !== "False" ? formatOmdbData(detailRes.data) : null;
        });

        const searchedMoviesToImport = removeDuplicates((await Promise.all(detailPromises)).filter(Boolean));

        if (searchedMoviesToImport.length > 0) {
          await importMovies(searchedMoviesToImport);
          movies = await getAllMoviesFromDb(search);
        }
      }
    }

    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Movie from DB
export const getMovie = async (req, res) => {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie Not Found" });
    }
    res.status(200).json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Movie
export const createMovie = async (req, res) => {
  try {
    const movie = await createMovieService(req.body);
    res.status(201).json({ success: true, message: "Movie Created", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Movie
export const updateMovie = async (req, res) => {
  try {
    const movie = await updateMovieService(req.params.id, req.body);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie Not Found" });
    }
    res.status(200).json({ success: true, message: "Movie Updated", movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Movie 
export const deleteMovie = async (req, res) => {
  try {
    const movie = await deleteMovieService(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie Not Found" });
    }
    res.status(200).json({ success: true, message: "Movie Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};