import axios from "axios";

// Remove trailing slash if present
const BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// Request Interceptor
// ==============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// Response Interceptor
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(
        new Error(error.response.data?.message || "Server error.")
      );
    }

    if (error.request) {
      return Promise.reject(
        new Error(
          "Unable to connect to the server. Please make sure JSON Server is running."
        )
      );
    }

    return Promise.reject(new Error(error.message || "Unexpected error."));
  }
);

export default api;