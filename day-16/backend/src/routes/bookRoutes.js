import express from "express";
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Read Books (All Authenticated Users)
router.get("/", authMiddleware, getBooks);
router.get("/:id", authMiddleware, getBookById);

// Create Book (Admin & Member)
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Admin", "Member"),
  createBook
);

// Update Book (Admin & Member)
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Member"),
  updateBook
);

// Delete Book (Admin & Member)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Admin", "Member"),
  deleteBook
);

export default router;