import { create } from "zustand";

const useUIStore = create((set) => ({
  // ==============================
  // State
  // ==============================

  sidebarCollapsed: false,
  darkMode: false,
  loading: false,
  deleteModalOpen: false,
  selectedTask: null,

  // ==============================
  // Sidebar
  // ==============================

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  // ==============================
  // Theme
  // ==============================

  toggleTheme: () =>
    set((state) => ({
      darkMode: !state.darkMode,
    })),

  // ==============================
  // Global Loader
  // ==============================

  setLoading: (loading) =>
    set({
      loading,
    }),

  // ==============================
  // Delete Modal
  // ==============================

  openDeleteModal: (task) =>
    set({
      deleteModalOpen: true,
      selectedTask: task,
    }),

  closeDeleteModal: () =>
    set({
      deleteModalOpen: false,
      selectedTask: null,
    }),

  // ==============================
  // Reset UI
  // ==============================

  resetUI: () =>
    set({
      sidebarCollapsed: false,
      darkMode: false,
      loading: false,
      deleteModalOpen: false,
      selectedTask: null,
    }),
}));

export default useUIStore;