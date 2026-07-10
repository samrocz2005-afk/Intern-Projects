import api from "./api";

// ==============================
// Get Student Profile
// ==============================

export const getProfile = async (studentId) => {
  const response = await api.get(`/students/${studentId}`);
  return response.data;
};

// ==============================
// Update Student Profile
// ==============================

export const updateProfile = async (id, profile) => {
  const response = await api.put(
    `/students/${id}`,
    profile
  );

  return response.data;
};