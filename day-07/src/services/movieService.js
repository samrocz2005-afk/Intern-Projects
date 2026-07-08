const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const BASE_URL = process.env.REACT_APP_BASE_URL;

console.log(JSON.stringify(API_KEY));
console.log(JSON.stringify(BASE_URL));
/**
 * Search Movies
 */
export async function searchMovies(searchTerm, page = 1) {
  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&s=${searchTerm}&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies.");
  }

  return await response.json();
}

/**
 * Get Movie Details
 */
export async function getMovieDetails(imdbID) {
  const response = await fetch(
    `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie details.");
  }

  return await response.json();
}