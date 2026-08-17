const express = require("express");

const shippingController = require("../controllers/shippingController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/shipping
router.get(
  "/",
  shippingController.getShipments
);

// GET /api/shipping/:id
router.get(
  "/:id",
  shippingController.getShipmentById
);

// GET /api/shipping/order/:orderId
router.get(
  "/order/:orderId",
  shippingController.getShipmentByOrder
);

// POST /api/shipping
router.post(
  "/",
  requireRole("Admin", "Manager"),
  shippingController.createShipment
);

// PUT /api/shipping/:id
router.put(
  "/:id",
  requireRole("Admin", "Manager"),
  shippingController.updateShipment
);

// PATCH /api/shipping/:id/status
router.patch(
  "/:id/status",
  requireRole("Admin", "Manager", "Staff"),
  shippingController.updateShipmentStatus
);

module.exports = router;