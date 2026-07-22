import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";
import { errorResponse } from "./utils/response.js";

const app = express();


// =====================
// Global Middlewares
// =====================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(helmet());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());


// =====================
// Health Check API
// =====================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Library Management API is running",
  });
});


// =====================
// API Routes
// =====================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/books", bookRoutes);


// =====================
// 404 Handler
// =====================

app.use((req, res) => {
  return errorResponse(
    res,
    "Route not found",
    404
  );
});


// =====================
// Global Error Handler
// =====================

app.use(errorMiddleware);


export default app;