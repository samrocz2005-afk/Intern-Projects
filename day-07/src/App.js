import React, { useState, useMemo, useCallback, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieList from "./components/MovieList";
import Pagination from "./components/Pagination";
import MovieModal from "./components/MovieModal";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";


import useMovies from "./hooks/useMovies";
import useLocalStorage from "./hooks/useLocalStorage";

import { searchMovies, getMovieDetails } from "./services/movieService";

function App() {
  // Search Inputf
  const [searchInput, setSearchInput] = useState("");

  //Show Favorites
  const [showFavorites, setShowFavorites] = useState(false);

  // Actual Search
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Featured Movies
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Favorites
  const [favorites, setFavorites] = useLocalStorage("favorites", []);


  // Search Results
  const { movies, loading, error, totalResults } = useMovies(
    searchTerm,
    currentPage,
  );

  const handleShowFavorites = () => {
    setShowFavorites((prev) => !prev);

    // Clear search when opening favorites
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  useEffect(() => {
    loadFeaturedMovies();
  }, []);

  const loadFeaturedMovies = async () => {
    setFeaturedLoading(true);

    try {
      const movieNames = ["Avengers", "Batman", "Spider-Man", "Harry Potter"];

      const results = await Promise.all(
        movieNames.map((movie) => searchMovies(movie)),
      );

      const allMovies = results.flatMap((result) => result.Search || []);

      setFeaturedMovies(allMovies);
    } catch (error) {
      console.error(error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  const favoriteCount = useMemo(() => {
    return favorites.length;
  }, [favorites]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearch = useCallback(() => {
    if (!searchInput.trim()) return;

    setSearchTerm(searchInput);
    setCurrentPage(1);
  }, [searchInput]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleFavorite = useCallback(
    (movie) => {
      const exists = favorites.some(
        (favorite) => favorite.imdbID === movie.imdbID,
      );

      if (exists) {
        setFavorites(
          favorites.filter((favorite) => favorite.imdbID !== movie.imdbID),
        );
      } else {
        setFavorites([...favorites, movie]);
      }
    },
    [favorites, setFavorites],
  );

  const handleViewDetails = useCallback(async (imdbID) => {
    try {
      const movie = await getMovieDetails(imdbID);
      setSelectedMovie(movie);
    } catch (error) {
      alert("Failed to load movie details.");
    }
  }, []);

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  // const displayMovies = searchTerm.trim() === "" ? featuredMovies : movies;
  const displayMovies = useMemo(() => {
    if (showFavorites) {
      return favorites;
    }

    if (searchTerm.trim()) {
      return movies;
    }

    return featuredMovies;
  }, [
    showFavorites,
    favorites,
    searchTerm,
    movies,
    featuredMovies,
  ]);

  const isLoading = showFavorites
    ? false
    : searchTerm.trim() === ""
    ? featuredLoading
    : loading;

  return (
    <div className="app">
      <Header
        favoriteCount={favoriteCount}
        showFavorites={showFavorites}
        onShowFavorites={handleShowFavorites}
      />

      {!showFavorites && (
        <SearchBar
          searchTerm={searchInput}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
        />
      )}

      <h2 className="section-title">
        {showFavorites
          ? "❤️ Favorite Movies"
          : searchTerm
          ? "🔍 Search Results"
          : "🔥 Featured Movies"}
      </h2>

      {isLoading ? (
        <Loader />
      ) : searchTerm && !showFavorites && error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <MovieList
            movies={displayMovies}
            favorites={favorites}
            onFavorite={handleFavorite}
            onViewDetails={handleViewDetails}
          />

          {!showFavorites &&
            searchTerm &&
            movies.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalResults={totalResults}
                onPageChange={handlePageChange}
              />
            )}
        </>
      )}

      <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
