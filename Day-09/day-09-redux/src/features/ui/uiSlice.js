import { createSlice } from "@reduxjs/toolkit";

// ==============================
// Initial State
// ==============================

const initialState = {
  sidebarCollapsed: false,
  theme: "light",
  taskModalOpen: false,
  selectedTask: null,
};

// ==============================
// Slice
// ==============================

const uiSlice = createSlice({
  name: "ui",

  initialState,

  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    openTaskModal(state, action) {
      state.taskModalOpen = true;
      state.selectedTask = action.payload || null;
    },

    closeTaskModal(state) {
      state.taskModalOpen = false;
      state.selectedTask = null;
    },

    setTheme(state, action) {
      state.theme = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  openTaskModal,
  closeTaskModal,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;