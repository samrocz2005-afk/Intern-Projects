import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cinemas: [],
  selectedCinema: null,
  loading: false,
};

const cinemaSlice = createSlice({
  name: "cinema",
  initialState,
  reducers: {
    setCinemas: (state, action) => {
      state.cinemas = action.payload;
    },

    setSelectedCinema: (state, action) => {
      state.selectedCinema = action.payload;
    },

    setCinemaLoading: (state, action) => {
      state.loading = action.payload;
    },

    clearSelectedCinema: (state) => {
      state.selectedCinema = null;
    },

    clearCinemas: (state) => {
      state.cinemas = [];
      state.selectedCinema = null;
      state.loading = false;
    },
  },
});

export const {
  setCinemas,
  setSelectedCinema,
  setCinemaLoading,
  clearSelectedCinema,
  clearCinemas,
} = cinemaSlice.actions;

export default cinemaSlice.reducer;