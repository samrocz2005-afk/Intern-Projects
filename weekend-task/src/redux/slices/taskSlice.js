import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTask: null,
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,

  reducers: {
    // ==========================
    // Selected Task
    // ==========================

    setSelectedTask: (state, action) => {
      state.selectedTask = action.payload;
    },

    clearSelectedTask: (state) => {
      state.selectedTask = null;
    },

    // ==========================
    // Loading
    // ==========================

    setTaskLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ==========================
    // Error
    // ==========================

    setTaskError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearTaskError: (state) => {
      state.error = null;
    },

    // ==========================
    // Reset
    // ==========================

    resetTaskState: () => initialState,
  },
});

export const {
  setSelectedTask,
  clearSelectedTask,
  setTaskLoading,
  setTaskError,
  clearTaskError,
  resetTaskState,
} = taskSlice.actions;

export default taskSlice.reducer;