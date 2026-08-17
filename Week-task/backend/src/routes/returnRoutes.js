const express = require("express");

const returnController = require("../controllers/returnController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/returns
router.get(
  "/",
  returnController.getReturns
);

// GET /api/returns/:id
router.get(
  "/:id",
  returnController.getReturnById
);

// POST /api/returns
router.post(
  "/",
  returnController.createReturn
);

// PATCH /api/returns/:id/approve
router.patch(
  "/:id/approve",
  requireRole("Admin", "Manager"),
  returnController.approveReturn
);

// PATCH /api/returns/:id/reject
router.patch(
  "/:id/reject",
  requireRole("Admin", "Manager"),
  returnController.rejectReturn
);

// PATCH /api/returns/:id/refund
router.patch(
  "/:id/refund",
  requireRole("Admin", "Manager"),
  returnController.processRefund
);

// PATCH /api/returns/:id/exchange
router.patch(
  "/:id/exchange",
  requireRole("Admin", "Manager"),
  returnController.createExchange // <--- Updated to match controller export
);

module.exports = router;