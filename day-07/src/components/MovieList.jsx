import React from "react";
import MovieCard from "./MovieCard";

function MovieList({
  movies,
  favorites,
  onFavorite,
  onViewDetails,
}) {
  if (movies.length === 0) {
    return (
      <div className="no-movies">
        <h2>No Movies Found</h2>
      </div>
    );
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          isFavorite={favorites.some(
            (favorite) => favorite.imdbID === movie.imdbID
          )}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

MovieList.defaultProps = {
  movies: [],
  favorites: [],
  onFavorite: () => {},
  onViewDetails: () => {},
};

export default MovieList;