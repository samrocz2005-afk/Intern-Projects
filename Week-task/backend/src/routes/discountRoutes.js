const express = require("express");

const discountController = require("../controllers/discountController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/discounts
router.get(
  "/",
  discountController.getDiscounts
);

// GET /api/discounts/:id
router.get(
  "/:id",
  discountController.getDiscountById
);

// POST /api/discounts
router.post(
  "/",
  requireRole("Admin", "Manager"),
  discountController.createDiscount
);

// PUT /api/discounts/:id
router.put(
  "/:id",
  requireRole("Admin", "Manager"),
  discountController.updateDiscount
);

// DELETE /api/discounts/:id
router.delete(
  "/:id",
  requireRole("Admin"),
  discountController.deleteDiscount
);

// PATCH /api/discounts/:id/status
router.patch(
  "/:id/status",
  requireRole("Admin", "Manager"),
  discountController.toggleDiscountStatus
);

module.exports = router;