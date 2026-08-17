const express = require("express");

const categoryController = require("../controllers/categoryController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

/*
 * All category routes require authentication.
 */
router.use(verifyToken);

/*
 * GET /api/categories
 */
router.get("/", categoryController.getCategories);

/*
 * GET /api/categories/:id
 */
router.get("/:id", categoryController.getCategoryById);

/*
 * POST /api/categories
 * Admin and Manager can create categories.
 */
router.post(
  "/",
  requireRole("Admin", "Manager"),
  categoryController.createCategory
);

/*
 * PUT /api/categories/:id
 * Admin and Manager can update categories.
 */
router.put(
  "/:id",
  requireRole("Admin", "Manager"),
  categoryController.updateCategory
);

/*
 * DELETE /api/categories/:id
 * Only Admin can delete categories.
 */
router.delete(
  "/:id",
  requireRole("Admin"),
  categoryController.deleteCategory
);

/*
 * PATCH /api/categories/:id/status
 * Activate/deactivate category.
 */
router.patch(
  "/:id/status",
  requireRole("Admin", "Manager"),
  categoryController.toggleCategoryStatus
);

module.exports = router;