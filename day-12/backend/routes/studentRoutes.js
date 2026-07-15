const express = require("express");

const router = express.Router();

const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// GET all students
router.get("/", getStudents);

// GET student by ID
router.get("/:id", getStudentById);

// CREATE new student
router.post("/", createStudent);

// UPDATE student
router.put("/:id", updateStudent);

// DELETE student
router.delete("/:id", deleteStudent);

module.exports = router;