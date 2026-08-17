import api from "./axios";

// Get Movies
export const getMovies = (search = "") => {
  return api.get(`/movies?search=${encodeURIComponent(search)}`);
};

// Get Single Movie
export const getMovie = (id) => {
  return api.get(`/movies/${id}`);
};

// Create Movie
export const createMovie = (data) => {
  return api.post("/movies", data);
};

// Update Movie
export const updateMovie = (id, data) => {
  return api.put(`/movies/${id}`, data);
};

// Delete Movie
export const deleteMovie = (id) => {
  return api.delete(`/movies/${id}`);
};