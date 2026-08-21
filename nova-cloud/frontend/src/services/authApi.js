import api from "./api";

const authApi = {
  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  register: async (userData) => {
    const response = await api.post(
      "/auth/register",
      userData
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  */

  login: async (credentials) => {
    const response = await api.post(
      "/auth/login",
      {
        email:
          credentials?.email
            ?.trim()
            .toLowerCase(),

        password:
          credentials?.password,
      }
    );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Get Current User
  |--------------------------------------------------------------------------
  */

  getMe: async () => {
    const response =
      await api.get("/auth/me");

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Update Profile
  |--------------------------------------------------------------------------
  */

  updateUserProfile: async (
    profileData
  ) => {
    const response =
      await api.put(
        "/auth/profile",
        profileData
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Upload Profile Image
  |--------------------------------------------------------------------------
  */

  uploadProfileImage: async (
    formData
  ) => {
    if (!(formData instanceof FormData)) {
      throw new Error(
        "Profile image upload requires FormData"
      );
    }

    const response =
      await api.put(
        "/auth/profile-image",
        formData,
        {
          headers: {
            /*
             * IMPORTANT:
             * Do NOT set:
             *
             * Content-Type: application/json
             *
             * Axios/browser will automatically
             * set multipart/form-data and boundary.
             */
            "Content-Type": undefined,
          },
        }
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Change Password
  |--------------------------------------------------------------------------
  */

  changePassword: async (
    passwordData
  ) => {
    const response =
      await api.put(
        "/auth/change-password",
        passwordData
      );

    return response.data;
  },

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  logout: async () => {
    const response =
      await api.post(
        "/auth/logout"
      );

    return response.data;
  },
};

export default authApi;