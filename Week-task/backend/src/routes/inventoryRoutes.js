const express = require("express");

const inventoryController = require("../controllers/inventoryController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

/*
 * All inventory routes require authentication.
 */
router.use(verifyToken);

/*
 * GET /api/inventory
 */
router.get(
  "/",
  inventoryController.getInventory
);

/*
 * GET /api/inventory/low-stock
 * MUST stay above /:id to prevent Express from treating "low-stock" as an ID
 */
router.get(
  "/low-stock",
  inventoryController.getLowStockProducts
);

/*
 * GET /api/inventory/out-of-stock
 * MUST stay above /:id
 */
router.get(
  "/out-of-stock",
  inventoryController.getOutOfStockProducts
);

/*
 * GET /api/inventory/:id
 */
router.get(
  "/:id",
  inventoryController.getInventoryByProduct
);

/*
 * PATCH /api/inventory/:id
 * Update stock directly.
 */
router.patch(
  "/:id",
  requireRole("Admin", "Manager"),
  inventoryController.updateStock
);

/*
 * PATCH /api/inventory/:id/adjust
 * Add/subtract stock through an adjustment operation.
 */
router.patch(
  "/:id/adjust",
  requireRole("Admin", "Manager"),
  inventoryController.adjustStock
);

module.exports = router;