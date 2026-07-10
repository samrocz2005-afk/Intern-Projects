import { create } from "zustand";
import {
  getProfile,
  updateProfile,
} from "../services/profileService";

const useProfileStore = create((set) => ({
  // ==============================
  // State
  // ==============================

  profile: null,
  loading: false,
  error: null,

  // ==============================
  // Fetch Profile
  // ==============================

  fetchProfile: async (studentId) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const profile = await getProfile(studentId);

      set({
        profile,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Failed to load profile.",
      });
    }
  },

  // ==============================
  // Update Profile
  // ==============================

  saveProfile: async (studentId, profileData) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const updatedProfile = await updateProfile(
        studentId,
        profileData
      );

      set({
        profile: updatedProfile,
        loading: false,
      });

      localStorage.setItem(
        "user",
        JSON.stringify(updatedProfile)
      );
    } catch (error) {
      set({
        loading: false,
        error: error.message || "Failed to update profile.",
      });
    }
  },

  // ==============================
  // Clear Error
  // ==============================

  clearError: () =>
    set({
      error: null,
    }),

  // ==============================
  // Reset
  // ==============================

  resetProfile: () =>
    set({
      profile: null,
      loading: false,
      error: null,
    }),
}));

export default useProfileStore;