const express = require("express");

const staffController = require("../controllers/staffController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

/*
 * All routes below require authentication.
 */
router.use(verifyToken);

// GET /api/staff
router.get(
  "/",
  requireRole("Admin", "Manager"),
  staffController.getStaff
);

// GET /api/staff/:id
router.get(
  "/:id",
  requireRole("Admin", "Manager"),
  staffController.getStaffById
);

// POST /api/staff
router.post(
  "/",
  requireRole("Admin"),
  staffController.createStaff
);

// PUT /api/staff/:id
router.put(
  "/:id",
  requireRole("Admin"),
  staffController.updateStaff
);

// PATCH /api/staff/:id/role
router.patch(
  "/:id/role",
  requireRole("Admin"),
  staffController.updateStaffRole
);

// PATCH /api/staff/:id/permissions
router.patch(
  "/:id/permissions",
  requireRole("Admin"),
  staffController.updateStaffPermissions
);

// PATCH /api/staff/:id/activate
router.patch(
  "/:id/activate",
  requireRole("Admin"),
  staffController.activateStaff
);

// PATCH /api/staff/:id/deactivate
router.patch(
  "/:id/deactivate",
  requireRole("Admin"),
  staffController.deactivateStaff
);

// DELETE /api/staff/:id
router.delete(
  "/:id",
  requireRole("Admin"),
  staffController.deleteStaff
);

module.exports = router;