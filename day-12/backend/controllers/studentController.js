const studentService = require("../services/studentService");


const getStudents = async (req, res, next) => {
  try {
    const students = await studentService.getStudents();

    res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: students,
    });

  } catch (error) {
    next(error);
  }
};


const getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Student fetched successfully",
      data: student,
    });

  } catch (error) {
    next(error);
  }
};


const createStudent = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });

  } catch (error) {
    next(error);
  }
};


const updateStudent = async (req, res, next) => {
  try {
    const student = await studentService.updateStudent(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });

  } catch (error) {
    next(error);
  }
};


const deleteStudent = async (req, res, next) => {
  try {
    const result = await studentService.deleteStudent(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: result,
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};