import axios from "axios";

const BASE_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// =======================
// STUDENT APIs
// =======================

// Get Students
// Pagination + Search + Department Filter
export const getStudents = (
  page = 1,
  limit = 5,
  search = "",
  department = "All"
) =>
  api.get("/students", {
    params: {
      page,
      limit,
      search,
      department,
    },
  });

// Get Student By ID
export const getStudentById = (id) =>
  api.get(`/students/${id}`);

// Create Student
export const addStudent = (student) =>
  api.post("/students", student);

// Update Student
export const updateStudent = (id, student) =>
  api.put(`/students/${id}`, student);

// Soft Delete Student
export const deleteStudent = (id) =>
  api.delete(`/students/${id}`);

// =======================
// COURSE APIs
// =======================

// Get All Courses
export const getCourses = () =>
  api.get("/courses");

// Get Course By ID
export const getCourseById = (id) =>
  api.get(`/courses/${id}`);

// Create Course
export const addCourse = (course) =>
  api.post("/courses", course);

// Update Course
export const updateCourse = (id, course) =>
  api.put(`/courses/${id}`, course);

// Delete Course
export const deleteCourse = (id) =>
  api.delete(`/courses/${id}`);

export default api;