import { configureStore } from "@reduxjs/toolkit";

import boardReducer from "./slices/boardSlice";
import taskReducer from "./slices/taskSlice";

const store = configureStore({
  reducer: {
    board: boardReducer,
    task: taskReducer,
  },

  devTools: process.env.NODE_ENV !== "production",
});

export default store;