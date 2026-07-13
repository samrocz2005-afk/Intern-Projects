import { STORAGE_KEYS } from "./constants";

// ===================================
// Save
// ===================================

export const saveData = (key, data) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Save Error:", error);
  }
};

// ===================================
// Get
// ===================================

export const getData = (key, defaultValue = null) => {
  try {
    const data = localStorage.getItem(key);

    return data
      ? JSON.parse(data)
      : defaultValue;
  } catch (error) {
    console.error("Read Error:", error);
    return defaultValue;
  }
};

// ===================================
// Remove
// ===================================

export const removeData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Remove Error:", error);
  }
};

// ===================================
// Clear
// ===================================

export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Clear Error:", error);
  }
};

// ===================================
// Token
// ===================================

export const saveToken = (token) => {
  saveData(STORAGE_KEYS.TOKEN, token);
};

export const getToken = () => {
  return getData(STORAGE_KEYS.TOKEN);
};

export const removeToken = () => {
  removeData(STORAGE_KEYS.TOKEN);
};

// ===================================
// User
// ===================================

export const saveUser = (user) => {
  saveData(STORAGE_KEYS.USER, user);
};

export const getUser = () => {
  return getData(STORAGE_KEYS.USER);
};

export const removeUser = () => {
  removeData(STORAGE_KEYS.USER);
};

// ===================================
// Boards
// ===================================

export const saveBoards = (boards) => {
  saveData(STORAGE_KEYS.BOARDS, boards);
};

export const getBoards = () => {
  return getData(STORAGE_KEYS.BOARDS, []);
};

// ===================================
// Tasks
// ===================================

export const saveTasks = (tasks) => {
  saveData(STORAGE_KEYS.TASKS, tasks);
};

export const getTasks = () => {
  return getData(STORAGE_KEYS.TASKS, []);
};

// ===================================
// Theme
// ===================================

export const saveTheme = (theme) => {
  saveData(STORAGE_KEYS.THEME, theme);
};

export const getTheme = () => {
  return getData(STORAGE_KEYS.THEME, "dark");
};

// ===================================
// Logout
// ===================================

export const logout = () => {
  removeToken();
  removeUser();
};