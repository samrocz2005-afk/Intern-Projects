import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});

// ==============================
// Request Interceptor
// Runs before every API request
// ==============================
api.interceptors.request.use(
  (config) => {
    // Automatically add API Key
    config.params = {
      ...config.params,
      appid: process.env.REACT_APP_API_KEY,
      units: "metric", // Celsius
    };

    console.log("Request:", config.url);

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log("Unauthorized");
          break;

        case 404:
          console.log("City Not Found");
          break;

        case 500:
          console.log("Server Error");
          break;

        default:
          console.log("Something Went Wrong");
      }
    } else {
      console.log("Network Error");
    }

    return Promise.reject(error);
  }
);

export default api;