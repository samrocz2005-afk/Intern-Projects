const express = require("express");
const cors = require("cors");

const logger = require("./middleware/logger");
const errorMiddleware = require("./middleware/errorMiddleware");

const studentRoutes = require("./routes/studentRoutes");
const bookRoutes = require("./routes/bookRoutes");
const seedRoutes = require("./routes/seedRoutes");

const app = express();

// ================================
// Built-in Middleware
// ================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Custom Middleware
// ================================
app.use(logger);

// ================================
// Health Check
// ================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Library Management API is running",
  });
});

// ================================
// API Routes
// ================================
app.use("/api/seed", seedRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/books", bookRoutes);

// ================================
// 404 Route
// ================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================================
// Global Error Middleware
// ================================
app.use(errorMiddleware);

module.exports = app;