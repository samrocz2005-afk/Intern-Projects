import express from "express";
import {
  getAllUsers,
  createAdminUser,
  changeUserRole,
  removeUser,
} from "../controllers/authController.js";
import verifyToken, { requireAdmin } from "../middleware/auth.js";
import { signupValidation } from "../middleware/validator.js";

const router = express.Router();

// All user management routes require Admin access
router.use(verifyToken, requireAdmin);

/**
 * GET /api/users
 * Get all users
 */
router.get("/", getAllUsers);
/**
 * POST /api/users
 * Create a new user (Reader/Member only)
 */
router.post("/", signupValidation, createAdminUser);

/**
 * PATCH /api/users/:id/role
 * Update user role
 */
router.patch("/:id/role", changeUserRole);

/**
 * DELETE /api/users/:id
 * Delete user
 */
router.delete("/:id", removeUser);

export default router;