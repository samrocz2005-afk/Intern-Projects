import React from "react";

function MovieCard({
  movie,
  isFavorite,
  onFavorite,
  onViewDetails,
}) {
  return (
    <div className="movie-card">
      <img
        className="movie-poster"
        src={
          movie.Poster !== "N/A"
            ? movie.Poster
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={movie.Title}
      />

      <div className="movie-info">
        <h3>{movie.Title}</h3>

        <p>
          <strong>Year:</strong> {movie.Year}
        </p>

        <p>
          <strong>Type:</strong> {movie.Type}
        </p>

        <div className="movie-buttons">
          <button
            className="details-btn"
            onClick={() => onViewDetails(movie.imdbID)}
          >
            View Details
          </button>

          <button
            className="favorite-btn"
            onClick={() => onFavorite(movie)}
          >
            {isFavorite ? "💔 Remove" : "❤️ Favorite"}
          </button>
        </div>
      </div>
    </div>
  );
}

MovieCard.defaultProps = {
  movie: {},
  isFavorite: false,
  onFavorite: () => {},
  onViewDetails: () => {},
};

export default MovieCard;