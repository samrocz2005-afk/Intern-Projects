import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginStudent } from "../../services/authService";

// ==============================
// Initial State
// ==============================

const storedToken = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// ==============================
// Async Login
// ==============================

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginStudent(credentials);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed.");
    }
  }
);

// ==============================
// Slice
// ==============================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // Login Pending
      // ==========================
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // ==========================
      // Login Success
      // ==========================
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })

      // ==========================
      // Login Failed
      // ==========================
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Login failed.";
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;