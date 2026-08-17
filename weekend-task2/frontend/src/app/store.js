import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import movieReducer from "../redux/movieSlice";
import cinemaReducer from "../redux/cinemaSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    movie: movieReducer,
    cinema: cinemaReducer,
  },
});

export default store;