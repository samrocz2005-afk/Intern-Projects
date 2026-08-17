const express = require("express");

const reviewController = require("../controllers/reviewController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/reviews
// Search and filter by rating/status.
router.get(
  "/",
  reviewController.getReviews
);

// GET /api/reviews/:id
router.get(
  "/:id",
  reviewController.getReviewById
);

// POST /api/reviews
router.post(
  "/",
  requireRole("Admin", "Manager", "Staff"),
  reviewController.createReview
);

// PATCH /api/reviews/:id/approve
router.patch(
  "/:id/approve",
  requireRole("Admin", "Manager"),
  reviewController.approveReview
);

// PATCH /api/reviews/:id/reject
router.patch(
  "/:id/reject",
  requireRole("Admin", "Manager"),
  reviewController.rejectReview
);

// DELETE /api/reviews/:id
router.delete(
  "/:id",
  requireRole("Admin", "Manager"),
  reviewController.deleteReview
);

module.exports = router;