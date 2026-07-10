import { create } from "zustand";
import { loginStudent } from "../services/authService";

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const useAuthStore = create((set) => ({
  // ==============================
  // State
  // ==============================

  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,

  // ==============================
  // Login
  // ==============================

  login: async (credentials) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const response = await loginStudent(credentials);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return true;
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Login failed.",
      });

      return false;
    }
  },

  // ==============================
  // Logout
  // ==============================

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  },

  // ==============================
  // Clear Error
  // ==============================

  clearError: () =>
    set({
      error: null,
    }),
}));

export default useAuthStore;