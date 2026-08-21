const Student = require("../models/Student");

// =========================
// GET ALL STUDENTS
// Pagination + Search + Department Filter
// =========================
const getStudents = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";
    const department = req.query.department || "All";

    const skip = (page - 1) * limit;

    const filter = {
      isDeleted: false,
    };

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Department filter
    if (department !== "All") {
      filter.department = department;
    }

    const totalStudents = await Student.countDocuments(filter);

    const students = await Student.find(filter)
      .populate("course", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      totalStudents,
      currentPage: page,
      totalPages: Math.ceil(totalStudents / limit),
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// =========================
// GET STUDENT BY ID
// =========================
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("course", "name");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// CREATE STUDENT
// =========================
const createStudent = async (req, res) => {
  try {
    const { email } = req.body;

    const existingStudent = await Student.findOne({ email });

    if (existingStudent) {
      if (existingStudent.isDeleted) {
        existingStudent.name = req.body.name;
        existingStudent.department = req.body.department;
        existingStudent.age = req.body.age;
        existingStudent.course = req.body.course;
        existingStudent.marks = req.body.marks;
        existingStudent.isDeleted = false;

        await existingStudent.save();

        const populatedStudent = await Student.findById(
          existingStudent._id
        ).populate("course", "name");

        return res.status(200).json({
          success: true,
          message: "Student restored successfully",
          data: populatedStudent,
        });
      }

      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const student = await Student.create(req.body);

    const populatedStudent = await Student.findById(student._id).populate(
      "course",
      "name"
    );

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: populatedStudent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// UPDATE STUDENT
// =========================
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("course", "name");

    if (!student || student.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// SOFT DELETE
// =========================
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        isDeleted: true,
      },
      {
        new: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};