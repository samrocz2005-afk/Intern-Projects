import axios from "axios";

const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// GET ALL STUDENTS
// =======================
export const getStudents = () => api.get("/students");

// =======================
// GET STUDENT BY ID
// =======================
export const getStudentById = (id) => api.get(`/students/${id}`);

// =======================
// ADD STUDENT
// =======================
export const addStudent = (student) =>
  api.post("/students", student);

// =======================
// UPDATE STUDENT
// =======================
export const updateStudent = (id, student) =>
  api.put(`/students/${id}`, student);

// =======================
// DELETE STUDENT
// =======================
export const deleteStudent = (id) =>
  api.delete(`/students/${id}`);

export default api;