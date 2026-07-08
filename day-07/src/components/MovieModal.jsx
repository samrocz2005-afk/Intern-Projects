import React from "react";

function MovieModal({ movie, onClose }) {
  if (!movie) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="movie-modal">
        <button
          className="close-button"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="modal-content">
          <img
            className="modal-poster"
            src={
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.Title}
          />

          <div className="modal-details">
            <h2>{movie.Title}</h2>

            <p>
              <strong>Year:</strong> {movie.Year}
            </p>

            <p>
              <strong>Genre:</strong> {movie.Genre}
            </p>

            <p>
              <strong>Runtime:</strong> {movie.Runtime}
            </p>

            <p>
              <strong>Director:</strong> {movie.Director}
            </p>

            <p>
              <strong>Actors:</strong> {movie.Actors}
            </p>

            <p>
              <strong>IMDb Rating:</strong> {movie.imdbRating}
            </p>

            <p>
              <strong>Plot:</strong> {movie.Plot}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

MovieModal.defaultProps = {
  movie: null,
  onClose: () => {},
};

export default MovieModal;