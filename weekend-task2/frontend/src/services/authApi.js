import api from "./axios";

/* ===========================
   Authentication
=========================== */

export const signup = (data) => api.post("/auth/signup", data);

export const login = (data) => api.post("/auth/login", data);

/* ===========================
   User Management (Admin)
=========================== */

// Get All Users
export const getUsers = () => api.get("/users");

// Create User
export const createUser = (data) => api.post("/users", data);

// Update User Role
export const updateUserRole = (id, role) =>
  api.patch(`/users/${id}/role`, { role });

// Delete User
export const deleteUser = (id) =>
  api.delete(`/users/${id}`);