const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

// =========================
// Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Routes
// =========================
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);

// =========================
// Home Route
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management API is Running",
  });
});

// =========================
// 404 Route
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

module.exports = app;