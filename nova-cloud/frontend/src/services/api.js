import axios from "axios";

import {
  API_URL,
  STORAGE_KEYS,
} from "../utils/constants";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: API_URL,

  headers: {
    Accept: "application/json",
  },

  timeout: 15000,
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(
      STORAGE_KEYS.ACCESS_TOKEN
    );

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    if (
      config.data instanceof FormData
    ) {
      delete config.headers[
        "Content-Type"
      ];
    } else {
      config.headers[
        "Content-Type"
      ] = "application/json";
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      console.error(
        "API NETWORK ERROR:",
        error.message
      );

      console.error(
        "Base URL:",
        API_URL
      );

      console.error(
        "Request URL:",
        error.config?.url
      );

      return Promise.reject(error);
    }

    console.error(
      "API ERROR:",
      error.response.status,
      error.config?.method?.toUpperCase(),
      error.config?.url,
      error.response.data
    );

    /*
    |--------------------------------------------------------------------------
    | Unauthorized
    |--------------------------------------------------------------------------
    */

    if (
      error.response.status === 401
    ) {
      localStorage.removeItem(
        STORAGE_KEYS.ACCESS_TOKEN
      );

      localStorage.removeItem(
        STORAGE_KEYS.USER
      );
    }

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Get Profile Image
|--------------------------------------------------------------------------
*/

export const getProfileImage = async () => {
  const response = await api.get(
    "/auth/profile-image",
    {
      responseType: "blob",
    }
  );

  return URL.createObjectURL(
    response.data
  );
};

export default api;