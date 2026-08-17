import express from "express";
import verifyToken, {
  requireAdmin,
  requireMemberOrAdmin,
} from "../middleware/auth.js";

import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

/**
 * GET /api/movies
 * Access: Reader, Member, Admin
 */
router.get("/", verifyToken, getMovies);

/**
 * GET /api/movies/:id
 * Access: Reader, Member, Admin
 */
router.get("/:id", verifyToken, getMovie);

/**
 * POST /api/movies
 * Access: Member, Admin
 */
router.post(
  "/",
  verifyToken,
  requireMemberOrAdmin,
  createMovie
);

/**
 * PUT /api/movies/:id
 * Access: Member, Admin
 */
router.put(
  "/:id",
  verifyToken,
  requireMemberOrAdmin,
  updateMovie
);

/**
 * DELETE /api/movies/:id
 * Access: Admin
 */
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  deleteMovie
);

export default router;