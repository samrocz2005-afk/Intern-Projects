import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import authApi from "../../services/authApi";
import { STORAGE_KEYS } from "../../utils/constants";

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const storedToken = localStorage.getItem(
  STORAGE_KEYS.ACCESS_TOKEN
);

const storedUser = localStorage.getItem(
  STORAGE_KEYS.USER
);

let parsedUser = null;

try {
  parsedUser = storedUser
    ? JSON.parse(storedUser)
    : null;
} catch (error) {
  console.error(
    "Failed to parse stored user:",
    error
  );

  localStorage.removeItem(
    STORAGE_KEYS.USER
  );
}

const initialState = {
  user: parsedUser,

  token: storedToken || null,

  isAuthenticated: Boolean(storedToken),

  loading: false,

  uploadingProfileImage: false,

  error: null,

  initialized: false,
};

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const register = createAsyncThunk(
  "auth/register",

  async (
    userData,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await authApi.register(
          userData
        );

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const login = createAsyncThunk(
  "auth/login",

  async (
    credentials,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await authApi.login(
          credentials
        );

      const data =
        response?.data;

      if (
        !data?.token ||
        !data?.user
      ) {
        console.error(
          "Invalid login response:",
          response
        );

        return rejectWithValue(
          "Invalid login response"
        );
      }

      localStorage.setItem(
        STORAGE_KEYS.ACCESS_TOKEN,
        data.token
      );

      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(data.user)
      );

      return {
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error(
        "Login API error:",
        error
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

export const getMe = createAsyncThunk(
  "auth/getMe",

  async (
    _,
    { rejectWithValue }
  ) => {
    try {
      const response =
        await authApi.getMe();

      const data =
        response?.data;

      /*
       * Support both:
       *
       * data: user
       *
       * and
       *
       * data: {
       *   user: user
       * }
       */

      const user =
        data?.user || data;

      if (!user?._id) {
        return rejectWithValue(
          "Unable to retrieve user profile"
        );
      }

      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(user)
      );

      return user;
    } catch (error) {
      localStorage.removeItem(
        STORAGE_KEYS.ACCESS_TOKEN
      );

      localStorage.removeItem(
        STORAGE_KEYS.USER
      );

      return rejectWithValue(
        error.response?.data?.message ||
          "Authentication expired"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Compatibility Alias
|--------------------------------------------------------------------------
*/

export const fetchUserProfile =
  getMe;

/*
|--------------------------------------------------------------------------
| Update User Profile
|--------------------------------------------------------------------------
*/

export const updateUserProfile =
  createAsyncThunk(
    "auth/updateUserProfile",

    async (
      profileData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await authApi.updateUserProfile(
            profileData
          );

        const data =
          response?.data;

        const user =
          data?.user || data;

        if (!user?._id) {
          return rejectWithValue(
            "Invalid profile response"
          );
        }

        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(user)
        );

        return user;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to update profile"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Upload Profile Image
|--------------------------------------------------------------------------
*/

export const uploadProfileImage =
  createAsyncThunk(
    "auth/uploadProfileImage",

    async (
      imageFile,
      { rejectWithValue }
    ) => {
      try {
        /*
        |--------------------------------------------------------------------------
        | Validate File
        |--------------------------------------------------------------------------
        */

        if (!imageFile) {
          return rejectWithValue(
            "Profile image is required"
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Validate MIME Type
        |--------------------------------------------------------------------------
        */

        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];

        if (
          !allowedTypes.includes(
            imageFile.type
          )
        ) {
          return rejectWithValue(
            "Only JPEG, PNG, WebP and GIF images are allowed"
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Size
        |--------------------------------------------------------------------------
        */

        const maxSize =
          5 * 1024 * 1024;

        if (
          imageFile.size > maxSize
        ) {
          return rejectWithValue(
            "Profile image must not exceed 5MB"
          );
        }

        /*
        |--------------------------------------------------------------------------
        | FormData
        |--------------------------------------------------------------------------
        */

        const formData =
          new FormData();

        formData.append(
          "profileImage",
          imageFile
        );

        /*
        |--------------------------------------------------------------------------
        | Upload
        |--------------------------------------------------------------------------
        */

        console.log(
          "Uploading profile image:",
          imageFile.name
        );

        const response =
          await authApi.uploadProfileImage(
            formData
          );

        console.log(
          "Upload response:",
          response
        );

        const data =
          response?.data;

        const user =
          data?.user || data;

        if (!user?._id) {
          console.error(
            "Invalid upload response:",
            response
          );

          return rejectWithValue(
            "Invalid profile image response"
          );
        }

        /*
        |--------------------------------------------------------------------------
        | Make sure profileImage exists
        |--------------------------------------------------------------------------
        */

        const profileImage =
          user.profileImage ||
          data?.profileImage;

        if (profileImage) {
          user.profileImage =
            profileImage;
        }

        /*
        |--------------------------------------------------------------------------
        | Save User
        |--------------------------------------------------------------------------
        */

        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(user)
        );

        console.log(
          "Updated user:",
          user
        );

        console.log(
          "Profile image:",
          user.profileImage
        );

        return user;
      } catch (error) {
        console.error(
          "Profile image upload error:",
          error
        );

        return rejectWithValue(
          error.response?.data?.message ||
            error.message ||
            "Failed to upload profile image"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePassword =
  createAsyncThunk(
    "auth/changePassword",

    async (
      passwordData,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await authApi.changePassword(
            passwordData
          );

        return response;
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Password change failed"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logout =
  createAsyncThunk(
    "auth/logout",

    async (
      _,
      { rejectWithValue }
    ) => {
      try {
        await authApi.logout();

        localStorage.removeItem(
          STORAGE_KEYS.ACCESS_TOKEN
        );

        localStorage.removeItem(
          STORAGE_KEYS.USER
        );

        return true;
      } catch (error) {
        localStorage.removeItem(
          STORAGE_KEYS.ACCESS_TOKEN
        );

        localStorage.removeItem(
          STORAGE_KEYS.USER
        );

        return rejectWithValue(
          error.response?.data?.message ||
            "Logout completed locally"
        );
      }
    }
  );

/*
|--------------------------------------------------------------------------
| Slice
|--------------------------------------------------------------------------
*/

const authSlice =
  createSlice({
    name: "auth",

    initialState,

    reducers: {
      clearAuthError: (
        state
      ) => {
        state.error = null;
      },

      setCredentials: (
        state,
        action
      ) => {
        const {
          user,
          token,
        } = action.payload;

        state.user = user;

        state.token = token;

        state.isAuthenticated =
          true;

        state.initialized =
          true;

        state.error = null;

        localStorage.setItem(
          STORAGE_KEYS.ACCESS_TOKEN,
          token
        );

        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify(user)
        );
      },
    },

    extraReducers: (
      builder
    ) => {
      /*
      |--------------------------------------------------------------------------
      | Register
      |--------------------------------------------------------------------------
      */

      builder
        .addCase(
          register.pending,
          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          register.fulfilled,
          (state) => {
            state.loading =
              false;

            state.error =
              null;
          }
        )

        .addCase(
          register.rejected,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload ||
              "Registration failed";
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Login
      |--------------------------------------------------------------------------
      */

      builder
        .addCase(
          login.pending,
          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          login.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.user =
              action.payload.user;

            state.token =
              action.payload.token;

            state.isAuthenticated =
              true;

            state.initialized =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          login.rejected,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload ||
              "Login failed";

            state.isAuthenticated =
              false;
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Get Me
      |--------------------------------------------------------------------------
      */

      builder
        .addCase(
          getMe.pending,
          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          getMe.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.user =
              action.payload;

            state.isAuthenticated =
              true;

            state.initialized =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          getMe.rejected,
          (state) => {
            state.loading =
              false;

            state.user =
              null;

            state.token =
              null;

            state.isAuthenticated =
              false;

            state.initialized =
              true;

            state.error =
              null;
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Update Profile
      |--------------------------------------------------------------------------
      */

      builder
        .addCase(
          updateUserProfile.pending,
          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          updateUserProfile.fulfilled,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            if (
              action.payload
            ) {
              state.user =
                action.payload;
            }

            state.error =
              null;
          }
        )

        .addCase(
          updateUserProfile.rejected,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload ||
              "Failed to update profile";
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Upload Profile Image
      |--------------------------------------------------------------------------
      */

      builder
        .addCase(
          uploadProfileImage.pending,
          (state) => {
            state.uploadingProfileImage =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          uploadProfileImage.fulfilled,
          (
            state,
            action
          ) => {
            state.uploadingProfileImage =
              false;

            /*
             * This is the important part.
             *
             * Redux immediately receives:
             *
             * user.profileImage =
             * "/uploads/profiles/..."
             */

            if (
              action.payload
            ) {
              state.user =
                action.payload;
            }

            state.error =
              null;
          }
        )

        .addCase(
          uploadProfileImage.rejected,
          (
            state,
            action
          ) => {
            state.uploadingProfileImage =
              false;

            state.error =
              action.payload ||
              "Failed to upload profile image";
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Change Password
      |--------------------------------------------------------------------------
      */

      builder
        .addCase(
          changePassword.pending,
          (state) => {
            state.loading =
              true;

            state.error =
              null;
          }
        )

        .addCase(
          changePassword.fulfilled,
          (state) => {
            state.loading =
              false;

            state.error =
              null;
          }
        )

        .addCase(
          changePassword.rejected,
          (
            state,
            action
          ) => {
            state.loading =
              false;

            state.error =
              action.payload ||
              "Password change failed";
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Logout
      |--------------------------------------------------------------------------
      */

      builder
        .addCase(
          logout.pending,
          (state) => {
            state.loading =
              true;
          }
        )

        .addCase(
          logout.fulfilled,
          (state) => {
            state.loading =
              false;

            state.user =
              null;

            state.token =
              null;

            state.isAuthenticated =
              false;

            state.error =
              null;

            state.initialized =
              true;

            state.uploadingProfileImage =
              false;
          }
        )

        .addCase(
          logout.rejected,
          (state) => {
            state.loading =
              false;

            state.user =
              null;

            state.token =
              null;

            state.isAuthenticated =
              false;

            state.error =
              null;

            state.initialized =
              true;

            state.uploadingProfileImage =
              false;
          }
        );
    },
  });

/*
|--------------------------------------------------------------------------
| Actions
|--------------------------------------------------------------------------
*/

export const {
  clearAuthError,
  setCredentials,
} =
  authSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectUser =
  (state) =>
    state.auth.user;

export const selectIsAdmin =
  (state) =>
    state.auth.user?.role ===
    "admin";

export const selectIsAuthenticated =
  (state) =>
    state.auth.isAuthenticated;

export const selectAuthLoading =
  (state) =>
    state.auth.loading;

export const selectProfileImageUploading =
  (state) =>
    state.auth
      .uploadingProfileImage;

export const selectAuthError =
  (state) =>
    state.auth.error;

export const selectAuthInitialized =
  (state) =>
    state.auth.initialized;

/*
|--------------------------------------------------------------------------
| Reducer
|--------------------------------------------------------------------------
*/

export default authSlice.reducer;