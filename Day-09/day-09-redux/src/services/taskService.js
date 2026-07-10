import api from "./api";

// ==============================
// Get All Tasks
// ==============================

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

// ==============================
// Create Task
// ==============================

export const createTask = async (task) => {
  const response = await api.post("/tasks", task);
  return response.data;
};

// ==============================
// Update Task
// ==============================

export const updateTask = async (id, task) => {
  const response = await api.put(`/tasks/${id}`, task);
  return response.data;
};

// ==============================
// Delete Task
// ==============================

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};