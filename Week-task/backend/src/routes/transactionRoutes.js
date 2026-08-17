const express = require("express");

const transactionController = require("../controllers/transactionController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/transactions
router.get(
  "/",
  transactionController.getTransactions
);

// GET /api/transactions/:id
router.get(
  "/:id",
  transactionController.getTransactionById
);

// GET /api/transactions/order/:orderId
router.get(
  "/order/:orderId",
  transactionController.getTransactionByOrder
);

// PATCH /api/transactions/:id/status
router.patch(
  "/:id/status",
  requireRole("Admin", "Manager"),
  transactionController.updatePaymentStatus
);

// PATCH /api/transactions/:id/refund
router.patch(
  "/:id/refund",
  requireRole("Admin", "Manager"),
  transactionController.updateRefundStatus
);

module.exports = router;