import { STORAGE_KEYS } from "./constants";

// ==============================
// Token
// ==============================

export const saveToken = (token) => {
  localStorage.setItem(
    STORAGE_KEYS.TOKEN,
    token
  );
};

export const getToken = () => {
  return localStorage.getItem(
    STORAGE_KEYS.TOKEN
  );
};

export const removeToken = () => {
  localStorage.removeItem(
    STORAGE_KEYS.TOKEN
  );
};

// ==============================
// User
// ==============================

export const saveUser = (user) => {
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(user)
  );
};

export const getUser = () => {
  const user = localStorage.getItem(
    STORAGE_KEYS.USER
  );

  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(
    STORAGE_KEYS.USER
  );
};

// ==============================
// Clear All
// ==============================

export const clearStorage = () => {
  localStorage.clear();
};