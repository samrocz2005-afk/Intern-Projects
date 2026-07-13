import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// Request Interceptor
// ===============================

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

// ===============================
// Response Interceptor
// ===============================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

// ===============================
// Generic Requests
// ===============================

export const getRequest = async (
  url,
  params = {}
) => {
  const response = await api.get(url, {
    params,
  });

  return response.data;
};

export const postRequest = async (
  url,
  body
) => {
  const response = await api.post(url, body);

  return response.data;
};

export const putRequest = async (
  url,
  body
) => {
  const response = await api.put(url, body);

  return response.data;
};

export const patchRequest = async (
  url,
 body
) => {
  const response = await api.patch(url, body);

  return response.data;
};

export const deleteRequest = async (
  url
) => {
  const response = await api.delete(url);

  return response.data;
};

// ===============================
// Authentication
// ===============================

export const login = async (
  email,
  password
) => {
  return getRequest("/users", {
    email,
    password,
  });
};

// ===============================
// Boards
// ===============================

export const getBoards = () =>
  getRequest("/boards");

export const getBoard = (id) =>
  getRequest(`/boards/${id}`);

export const createBoard = (board) =>
  postRequest("/boards", board);

export const updateBoard = (board) =>
  putRequest(`/boards/${board.id}`, board);

export const removeBoard = (id) =>
  deleteRequest(`/boards/${id}`);

// ===============================
// Tasks
// ===============================

export const updateBoardTasks = (
  board
) => putRequest(`/boards/${board.id}`, board);

// ===============================
// Settings
// ===============================

export const getSettings = () =>
  getRequest("/settings");

export const updateSettings = (
  settings
) => patchRequest("/settings", settings);

export default api;