const Course = require("../models/Course");

// Get all courses from 
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCourses,
};