const express = require("express");

const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const validateStudent = require("../middleware/validate");

const router = express.Router();

router.get("/", getStudents);

// =========================
// GET STUDENT BY ID
// =========================
router.get("/:id", getStudentById);

// =========================
// CREATE STUDENT
// =========================
router.post("/", validateStudent, createStudent);

// =========================
// UPDATE STUDENT
// =========================
router.put("/:id", validateStudent, updateStudent);

// =========================
// SOFT DELETE STUDENT
// =========================
router.delete("/:id", deleteStudent);

module.exports = router;