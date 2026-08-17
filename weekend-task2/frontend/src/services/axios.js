import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token ? "EXISTS" : "MISSING");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("API REQUEST:", {
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;