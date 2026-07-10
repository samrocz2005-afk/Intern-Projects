import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getProfile,
  updateProfile as updateProfileAPI, // Aliased to prevent local variable naming conflicts
} from "../../services/profileService";

// ==============================
// Initial State
// ==============================

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

// ==============================
// Fetch Profile
// ==============================

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (studentId, { rejectWithValue }) => {
    try {
      const data = await getProfile(studentId);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile."
      );
    }
  }
);

// ==============================
// Update Profile (Renamed and Flattened)
// ==============================

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      // Extracts the id directly from the profileData object sent by the form values
      const id = profileData.id || profileData._id; 
      
      const data = await updateProfileAPI(id, profileData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile."
      );
    }
  }
);

// ==============================
// Slice
// ==============================

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {
    clearProfileError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================
      // Fetch Profile
      // ======================

      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // Update Profile
      // ======================

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear old errors before starting a new update operation
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload; // Updates the state with the fresh data returned from the server
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfileError } = profileSlice.actions;

export default profileSlice.reducer;