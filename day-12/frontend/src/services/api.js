import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================
// Student APIs
// ======================

export const getStudents = () => api.get("/students");

export const getStudentById = (id) =>
  api.get(`/students/${id}`);

export const createStudent = (student) =>
  api.post("/students", student);

export const updateStudent = (id, student) =>
  api.put(`/students/${id}`, student);

export const deleteStudent = (id) =>
  api.delete(`/students/${id}`);

// ======================
// Book APIs
// ======================

export const getBooks = () => api.get("/books");

export const getBookById = (id) =>
  api.get(`/books/${id}`);

export const createBook = (book) =>
  api.post("/books", book);

export const updateBook = (id, book) =>
  api.put(`/books/${id}`, book);

export const deleteBook = (id) =>
  api.delete(`/books/${id}`);

export default api;