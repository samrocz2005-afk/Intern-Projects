import api from "./axios";

/*
 * --------------------------------------------------
 * Signup
 * --------------------------------------------------
 */

export const signup = async (data) => {
  const response = await api.post("/auth/signup", data);

  return response;
};

/*
 * --------------------------------------------------
 * Login
 * --------------------------------------------------
 */

export const login = async (data) => {
  const response = await api.post("/auth/login", data);

  return response;
};