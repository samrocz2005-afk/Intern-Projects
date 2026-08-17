const express = require("express");

const vendorController = require("../controllers/vendorController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/vendors
router.get(
  "/",
  vendorController.getVendors
);

// GET /api/vendors/:id
router.get(
  "/:id",
  vendorController.getVendorById
);

// POST /api/vendors
router.post(
  "/",
  requireRole("Admin", "Manager"),
  vendorController.createVendor
);

// PUT /api/vendors/:id
router.put(
  "/:id",
  requireRole("Admin", "Manager"),
  vendorController.updateVendor
);

// PATCH /api/vendors/:id/approve
router.patch(
  "/:id/approve",
  requireRole("Admin", "Manager"),
  vendorController.approveVendor
);

// PATCH /api/vendors/:id/reject
router.patch(
  "/:id/reject",
  requireRole("Admin", "Manager"),
  vendorController.rejectVendor
);

// DELETE /api/vendors/:id
router.delete(
  "/:id",
  requireRole("Admin"),
  vendorController.deleteVendor
);

module.exports = router;