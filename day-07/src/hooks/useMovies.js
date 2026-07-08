import { useEffect, useState } from "react";
import { searchMovies } from "../services/movieService";

function useMovies(searchTerm, currentPage) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setMovies([]);
      setTotalResults(0);
      return;
    }

    const fetchMovies = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await searchMovies(searchTerm, currentPage);

        if (data.Response === "True") {
          setMovies(data.Search);
          setTotalResults(Number(data.totalResults));
        } else {
          setMovies([]);
          setTotalResults(0);
          setError(data.Error);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setMovies([]);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [searchTerm, currentPage]);

  return {
    movies,
    loading,
    error,
    totalResults,
  };
}

export default useMovies;