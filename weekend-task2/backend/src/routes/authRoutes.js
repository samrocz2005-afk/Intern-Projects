import express from "express";
import { signup, login } from "../controllers/authController.js";
import {
  signupValidation,
  loginValidation,
} from "../middleware/validator.js";

const router = express.Router();

/**
 * POST /api/auth/signup
 */
router.post("/signup", signupValidation, signup);

/**
 * POST /api/auth/login
 */
router.post("/login", loginValidation, login);

export default router;