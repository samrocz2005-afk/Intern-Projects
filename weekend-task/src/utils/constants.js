// ==============================
// App
// ==============================

export const APP_NAME = "Kanban";

export const APP_VERSION = "1.0.0";

// ==============================
// Theme
// ==============================

export const THEME = {
  DARK: "dark",
  LIGHT: "light",
};

// ==============================
// Local Storage Keys
// ==============================

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  BOARDS: "boards",
  TASKS: "tasks",
  THEME: "theme",
};

// ==============================
// Board Status
// ==============================

export const BOARD_STATUS = {
  TODO: "todo",
  DOING: "doing",
  DONE: "done",
};

// ==============================
// Default Columns
// ==============================

export const DEFAULT_COLUMNS = [
  {
    id: "todo",
    name: "Todo",
    tasks: [],
  },
  {
    id: "doing",
    name: "Doing",
    tasks: [],
  },
  {
    id: "done",
    name: "Done",
    tasks: [],
  },
];

// ==============================
// Routes
// ==============================

export const ROUTES = {
  LOGIN: "/login",
  DASHBOARD: "/",
};

// ==============================
// Messages
// ==============================

export const SUCCESS_MESSAGES = {
  LOGIN: "Login successful",
  LOGOUT: "Logged out successfully",

  BOARD_CREATED: "Board created successfully",
  BOARD_UPDATED: "Board updated successfully",
  BOARD_DELETED: "Board deleted successfully",

  TASK_CREATED: "Task created successfully",
  TASK_UPDATED: "Task updated successfully",
  TASK_DELETED: "Task deleted successfully",
};

export const ERROR_MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong.",
  LOGIN_FAILED: "Invalid email or password.",
};

// ==============================
// Colors
// ==============================

export const COLORS = {
  TODO: "#49C4E5",
  DOING: "#8471F2",
  DONE: "#67E2AE",
};