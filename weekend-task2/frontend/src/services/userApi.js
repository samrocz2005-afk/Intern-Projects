import api from "./axios";

// Get all users (Admin only)
export const getUsers = async () => {
  const response = await api.get("/users");
  return response;
};

// Update user role (Admin only)
export const updateUserRole = async (id, role) => {
  const response = await api.patch(`/users/${id}/role`, {
    role,
  });

  return response;
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};

