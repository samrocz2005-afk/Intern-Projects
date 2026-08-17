import { createSlice } from "@reduxjs/toolkit";

// Helper to safely normalize roles into an array
const normalizeUserRole = (user) => {
  if (!user) return null;
  return {
    ...user,
    role: Array.isArray(user.role) ? user.role : [user.role || "Reader"],
  };
};

const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  user: normalizeUserRole(storedUser),
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const normalizedUser = normalizeUserRole(action.payload.user);

      state.user = normalizedUser;
      state.token = action.payload.token;
      state.isLoggedIn = true;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;