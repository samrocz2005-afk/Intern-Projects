export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

export const ROLES = {
  ADMIN: "Admin",
  MEMBER: "Member",
  READER: "Reader",
};

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  BOOKS: "/books",
  USERS: "/users",
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};