import express from "express";
import {
  getCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
} from "../controllers/cinemaController.js";
import verifyToken, {
  requireAdmin,
  requireMemberOrAdmin,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getCinemas);

router.get("/:id", verifyToken, getCinemaById);

router.post("/", verifyToken, requireMemberOrAdmin, createCinema);

router.put("/:id", verifyToken, requireMemberOrAdmin, updateCinema);

router.delete("/:id", verifyToken, requireAdmin, deleteCinema);

export default router;
