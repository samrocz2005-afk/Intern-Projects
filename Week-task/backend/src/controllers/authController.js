const asyncHandler = require("../utils/asyncHandler");
const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await authService.signup({
    name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email ? email.trim().toLowerCase() : "";

  // 1. Check if the provided credentials match your .env admin settings
  if (
    process.env.ADMIN_EMAIL &&
    normalizedEmail === process.env.ADMIN_EMAIL.trim().toLowerCase() &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { email: process.env.ADMIN_EMAIL, role: "admin" },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      data: {
        token,
        user: {
          name: process.env.ADMIN_NAME || "Admin",
          email: process.env.ADMIN_EMAIL,
          role: "admin",
        },
      },
    });
  }

  // 2. Otherwise, proceed with normal database login for regular users/customers
  const result = await authService.login({
    email,
    password,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

module.exports = {
  signup,
  login,
};