import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
  selectedMovie: null,
  search: "",
  language: "All",
};

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
    },

    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },

    setSearch: (state, action) => {
      state.search = action.payload;
    },

    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const {
  setMovies,
  setSelectedMovie,
  setSearch,
  setLanguage,
} = movieSlice.actions;

export default movieSlice.reducer;