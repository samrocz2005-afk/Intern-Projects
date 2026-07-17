const validateStudent = (req, res, next) => {
  const { name, email, department, age } = req.body;

  if (!name || !email || !department || !age) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  next();
};

module.exports = validateStudent;