import { create } from "zustand";
import {
  getProfile,
  updateProfile,
} from "../services/profileService";

const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async (studentId) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const profile = await getProfile(studentId);

      set({
        profile,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to load profile.",
      });
    }
  },

  saveProfile: async (studentId, profile) => {
    try {
      set({
        loading: true,
        error: null,
      });

      const updatedProfile = await updateProfile(
        studentId,
        profile
      );

      set({
        profile: updatedProfile,
        loading: false,
      });

      return updatedProfile;
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile.",
      });

      throw error;
    }
  },

  clearError: () =>
    set({
      error: null,
    }),

  resetProfile: () =>
    set({
      profile: null,
      loading: false,
      error: null,
    }),
}));

export default useProfileStore;