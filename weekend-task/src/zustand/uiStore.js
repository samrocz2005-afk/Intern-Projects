import { create } from "zustand";

const savedTheme = localStorage.getItem("theme");
const isDark = savedTheme ? savedTheme === "dark" : true;

document.body.setAttribute(
  "data-theme",
  isDark ? "dark" : "light"
);

const useUIStore = create((set) => ({

  darkMode: isDark,

  toggleTheme: () =>
    set((state) => {
      const darkMode = !state.darkMode;

      localStorage.setItem(
        "theme",
        darkMode ? "dark" : "light"
      );

      document.body.setAttribute(
        "data-theme",
        darkMode ? "dark" : "light"
      );

      return { darkMode };
    }),

  setDarkMode: (value) => {
    localStorage.setItem(
      "theme",
      value ? "dark" : "light"
    );

    document.body.setAttribute(
      "data-theme",
      value ? "dark" : "light"
    );

    set({ darkMode: value });
  },

  sidebarCollapsed: false,

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  setSidebarCollapsed: (value) =>
    set({
      sidebarCollapsed: value,
    }),


  mobileSidebarOpen: false,

  openMobileSidebar: () =>
    set({
      mobileSidebarOpen: true,
    }),

  closeMobileSidebar: () =>
    set({
      mobileSidebarOpen: false,
    }),

  showAddTask: false,

  setShowAddTask: (value) =>
    set({
      showAddTask: value,
    }),


  showAddBoard: false,

  setShowAddBoard: (value) =>
    set({
      showAddBoard: value,
    }),

  showEditBoard: false,

  setShowEditBoard: (value) =>
    set({
      showEditBoard: value,
    }),


  showDeleteBoard: false,

  setShowDeleteBoard: (value) =>
    set({
      showDeleteBoard: value,
    }),


  selectedTask: null,

  setSelectedTask: (task) =>
    set({
      selectedTask: task,
    }),

  clearSelectedTask: () =>
    set({
      selectedTask: null,
    }),

  resetUI: () =>
    set({
      mobileSidebarOpen: false,
      showAddTask: false,
      showAddBoard: false,
      showEditBoard: false,
      showDeleteBoard: false,
      selectedTask: null,
    }),
}));

export default useUIStore;