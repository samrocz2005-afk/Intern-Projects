// Entire UI State
export const selectUIState = (state) => state.ui;

// Sidebar
export const selectSidebarCollapsed = (state) =>
  state.ui.sidebarCollapsed;

// Theme
export const selectTheme = (state) =>
  state.ui.theme;

// Task Modal
export const selectTaskModalOpen = (state) =>
  state.ui.taskModalOpen;

// Selected Task
export const selectSelectedTask = (state) =>
  state.ui.selectedTask;