const express = require("express");

const settingsController = require("../controllers/settingsController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/settings
router.get(
  "/",
  requireRole("Admin", "Manager"),
  settingsController.getSettings
);

// PUT /api/settings
router.put(
  "/",
  requireRole("Admin"),
  settingsController.updateSettings
);

// PATCH /api/settings/store
router.patch(
  "/store",
  requireRole("Admin"),
  settingsController.updateStoreSettings
);

// PATCH /api/settings/profile
router.patch(
  "/profile",
  requireRole("Admin"),
  settingsController.updateProfileSettings
);

module.exports = router;