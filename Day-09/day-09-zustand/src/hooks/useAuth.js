import { create } from "zustand";

// This creates your Zustand Authentication Store
export const useAuthStore = create((set) => ({
  // ==============================
  // State
  // ==============================
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // ==============================
  // Actions
  // ==============================
  
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      if (credentials.email && credentials.password) {
        // FIX: Changed id from 'student-123' string token to a numerical value string or '1' 
        // to prevent 404 router exceptions if your database reads it as a standard integer lookup.
        const mockUser = { 
          id: "1", 
          name: "Sam", 
          email: credentials.email 
        };
        
        set({ user: mockUser, isAuthenticated: true, loading: false });
        return true;
      }
      return false;
    } catch (err) {
      set({ 
        error: err.response?.data?.message || err.message || "Login failed", 
        loading: false 
      });
      return false;
    }
  },

  // Clears active error messages when form changes or unmounts
  clearErrors: () => set({ error: null }),
  
  // Clears user context on logout
  logout: () => set({ user: null, isAuthenticated: false, error: null })
}));

// The hook being called by your components
function useAuth() {
  const auth = useAuthStore();
  return auth;
}

export default useAuth;