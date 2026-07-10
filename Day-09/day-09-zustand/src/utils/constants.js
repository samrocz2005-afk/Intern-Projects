// ==============================
// API
// ==============================

export const API_URL =
  process.env.REACT_APP_API_URL;

// ==============================
// Routes
// ==============================

export const ROUTES = {
  LOGIN: "/login",

  DASHBOARD: "/dashboard",

  TASKS: "/dashboard/tasks",

  PROFILE: "/dashboard/profile",
};

// ==============================
// Task Status
// ==============================

export const TASK_STATUS = {
  PENDING: "Pending",

  IN_PROGRESS: "In Progress",

  COMPLETED: "Completed",
};

// ==============================
// Task Priority
// ==============================

export const TASK_PRIORITY = {
  HIGH: "High",

  MEDIUM: "Medium",

  LOW: "Low",
};

// ==============================
// Local Storage Keys
// ==============================

export const STORAGE_KEYS = {
  TOKEN: "token",

  USER: "user",
};

// ==============================
// Pagination
// ==============================

export const PAGE_SIZE = 5;

export const PAGE_SIZE_OPTIONS = [
  "5",
  "10",
  "15",
];

// ==============================
// Theme
// ==============================

export const THEMES = {
  LIGHT: "light",

  DARK: "dark",
};