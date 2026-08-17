import { useEffect, useState, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Layout } from "antd";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MovieTable from "../components/MovieTable";
import MovieDrawer from "../components/MovieDrawer";
import AddEditMovieModal from "../components/AddEditMovieModal";

import useDebounce from "../hooks/useDebounce";

import {
  setMovies,
  setSelectedMovie,
  setSearch,
  setLanguage,
} from "../redux/movieSlice";

import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../services/movieApi";

const { Content } = Layout;

function Dashboard() {
  const dispatch = useDispatch();

  const {
    movies = [],
    selectedMovie,
    search = "",
    language = "All",
  } = useSelector((state) => state.movie || {});

  const { user } = useSelector((state) => state.auth || {});

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMovieModalOpen, setEditMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [modalLoading, setModalLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  /*
   * Normalize user roles
   */
  const userRoles = Array.isArray(user?.role)
    ? user.role.map((role) =>
        typeof role === "string" ? role.toLowerCase() : ""
      )
    : [
        typeof user?.role === "string"
          ? user.role.toLowerCase()
          : "reader",
      ];

  const isAdmin = userRoles.includes("admin");
  const isMember = userRoles.includes("member");

  const canCreate =
    isAdmin ||
    isMember ||
    userRoles.includes("movie create");

  const canEdit =
    isAdmin ||
    isMember ||
    userRoles.includes("movie update");

  const canDelete =
    isAdmin ||
    isMember ||
    userRoles.includes("movie delete");

  const userRole = user?.role || "Reader";

  /*
   * Debounced search
   */
  const debouncedSearch = useDebounce(search, 500);

  /*
   * Normalize movie data
   */
  const normalizeMovieData = useCallback((movie) => {
    if (!movie) {
      return null;
    }

    const raw = movie._doc || movie;

    const cast = [raw.hero, raw.heroine]
      .filter(Boolean)
      .join(", ");

    const id = raw._id || raw.id;

    const Title = raw.title || raw.Title || "N/A";
    const Year = raw.year || raw.Year || "N/A";
    const Poster = raw.poster || raw.Poster || "";
    const Language = raw.language || raw.Language || "N/A";
    const Genre = raw.genre || raw.Genre || "N/A";
    const Plot = raw.plot || raw.Plot || "N/A";
    const Director = raw.director || raw.Director || "N/A";
    const Runtime = raw.runtime || raw.Runtime || "N/A";
    const Actors =
      raw.actors || (cast.trim() ? cast : "N/A");

    return {
      ...raw,

      _id: id,
      id,

      title: raw.title || raw.Title || "N/A",
      year: raw.year || raw.Year || "N/A",
      poster: raw.poster || raw.Poster || "",
      language: raw.language || raw.Language || "N/A",
      genre: raw.genre || raw.Genre || "N/A",
      plot: raw.plot || raw.Plot || "N/A",
      director: raw.director || raw.Director || "N/A",
      runtime: raw.runtime || raw.Runtime || "N/A",
      actors: raw.actors || Actors,

      Title,
      Year,
      Poster,
      Language,
      Genre,
      Actors,
      Director,
      Runtime,
      Plot,
    };
  }, []);

  /*
   * Load initial movies
   */
  const loadInitialMovies = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getMovies("");

      const movieList =
        res?.data?.movies ||
        res?.data?.data ||
        res?.data ||
        [];

      const normalizedMovies = Array.isArray(movieList)
        ? movieList
            .map(normalizeMovieData)
            .filter(Boolean)
        : [];

      dispatch(setMovies(normalizedMovies));
    } catch (error) {
      console.error(
        "Failed to load initial movies:",
        error
      );

      message.error("Failed to load initial movies");
    } finally {
      setLoading(false);
    }
  }, [dispatch, normalizeMovieData]);

  /*
   * Search movies
   */
  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getMovies(debouncedSearch);

      const movieList =
        res?.data?.movies ||
        res?.data?.data ||
        res?.data ||
        [];

      const normalizedMovies = Array.isArray(movieList)
        ? movieList
            .map(normalizeMovieData)
            .filter(Boolean)
        : [];

      dispatch(setMovies(normalizedMovies));
    } catch (error) {
      console.error(
        "Failed to load searched movies:",
        error
      );

      message.error("Failed to load movies");
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    dispatch,
    normalizeMovieData,
  ]);

  /*
   * Initial load + search
   */
  useEffect(() => {
    if (debouncedSearch.trim()) {
      loadMovies();
    } else {
      loadInitialMovies();
    }
  }, [
    debouncedSearch,
    loadMovies,
    loadInitialMovies,
  ]);

  /*
   * Language filter
   */
  const filteredMovies = useMemo(() => {
    if (language === "All") {
      return movies;
    }

    return movies.filter((movie) => {
      const langStr =
        movie.language ||
        movie.Language ||
        "";

      return langStr
        .toLowerCase()
        .split(",")
        .map((lang) => lang.trim())
        .includes(language.toLowerCase());
    });
  }, [movies, language]);

  /*
   * View movie
   */
  const handleView = useCallback(
    async (movie) => {
      try {
        const idToFetch =
          movie?._id || movie?.id;

        if (!idToFetch) {
          message.error("Movie ID is missing");
          return;
        }

        const res = await getMovie(idToFetch);

        const rawData =
          res?.data?.movie ||
          res?.data?.data ||
          res?.data;

        const mergedData = {
          ...movie,
          ...rawData,
        };

        dispatch(
          setSelectedMovie(
            normalizeMovieData(mergedData)
          )
        );

        setDrawerOpen(true);
      } catch (error) {
        console.error(
          "Failed to load movie details:",
          error
        );

        message.error(
          "Failed to load movie details"
        );
      }
    },
    [dispatch, normalizeMovieData]
  );

  /*
   * Edit movie
   */
  const handleEdit = useCallback((movie) => {
    setEditingMovie(movie);
    setEditMovieModalOpen(true);
  }, []);

  /*
   * Add movie
   */
  const handleAddMovie = useCallback(() => {
    setEditingMovie(null);
    setEditMovieModalOpen(true);
  }, []);

  /*
   * Delete movie
   */
  const handleDelete = useCallback(
    async (movie) => {
      const movieId =
        movie?._id || movie?.id;

      if (!movieId) {
        message.error("Movie ID is missing");
        return;
      }

      try {
        await deleteMovie(movieId);

        message.success(
          "Movie deleted successfully"
        );

        dispatch(
          setMovies(
            movies.filter(
              (item) =>
                (item._id || item.id) !== movieId
            )
          )
        );
      } catch (error) {
        console.error(
          "Failed to delete movie:",
          error
        );

        message.error(
          error?.response?.data?.message ||
            "Failed to delete movie"
        );
      }
    },
    [dispatch, movies]
  );

  /*
   * Create / Update movie
   */
  const handleModalSubmit = useCallback(
    async (formData) => {
      setModalLoading(true);

      const targetId =
        editingMovie?._id ||
        editingMovie?.id;

      try {
        /*
         * UPDATE
         */
        if (targetId) {
          const res = await updateMovie(
            targetId,
            formData
          );

          const updatedData =
            normalizeMovieData(
              res?.data?.movie ||
                res?.data?.data ||
                res?.data ||
                formData
            );

          message.success(
            "Movie updated successfully"
          );

          dispatch(
            setMovies(
              movies.map((movie) =>
                (movie._id || movie.id) ===
                targetId
                  ? updatedData
                  : movie
              )
            )
          );
        }

        /*
         * CREATE
         */
        else {
          const res = await createMovie(
            formData
          );

          const newData =
            normalizeMovieData(
              res?.data?.movie ||
                res?.data?.data ||
                res?.data ||
                formData
            );

          message.success(
            "Movie added successfully"
          );

          dispatch(
            setMovies([
              newData,
              ...movies,
            ])
          );
        }

        setEditMovieModalOpen(false);
        setEditingMovie(null);
      } catch (error) {
        console.error(
          "Failed to save movie:",
          error
        );

        message.error(
          error?.response?.data?.message ||
            "Failed to save movie"
        );
      } finally {
        setModalLoading(false);
      }
    },
    [
      dispatch,
      editingMovie,
      movies,
      normalizeMovieData,
    ]
  );

  /*
   * Close modal
   */
  const handleModalCancel = useCallback(() => {
    setEditMovieModalOpen(false);
    setEditingMovie(null);
  }, []);

  /*
   * Close drawer
   */
  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    dispatch(setSelectedMovie(null));
  }, [dispatch]);

  return (
    <Layout
      style={{
        height: "100vh",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* =========================
          HEADER
      ========================== */}
      <Header />

      {/* =========================
          SIDEBAR + MAIN CONTENT
      ========================== */}
      <Layout
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <Content
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            height: "100%",
            padding: 20,
            overflow: "hidden",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* MOVIE TABLE */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              height: "100%",
              overflow: "hidden",
            }}
          >
            <MovieTable
              movies={filteredMovies}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAddMovie}
              search={search}
              setSearch={(value) =>
                dispatch(setSearch(value))
              }
              language={language}
              setLanguage={(value) =>
                dispatch(setLanguage(value))
              }
              loading={loading}
              userRole={userRole}
              canCreate={canCreate}
              canEdit={canEdit}
              canDelete={canDelete}
            />
          </div>
        </Content>
      </Layout>

      {/* =========================
          MOVIE DRAWER
      ========================== */}
      <MovieDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        movie={selectedMovie}
      />

      {/* =========================
          ADD / EDIT MODAL
      ========================== */}
      <AddEditMovieModal
        open={editMovieModalOpen}
        movie={editingMovie}
        loading={modalLoading}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
      />
    </Layout>
  );
}

export default Dashboard;