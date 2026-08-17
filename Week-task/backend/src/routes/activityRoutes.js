const express = require("express");

const activityController = require("../controllers/activityController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/activity-logs
router.get(
  "/",
  requireRole("Admin", "Manager"),
  activityController.getActivityLogs
);

// GET /api/activity-logs/user/:userId
router.get(
  "/user/:userId",
  requireRole("Admin", "Manager"),
  activityController.getUserActivityLogs
);

// GET /api/activity-logs/:id
router.get(
  "/:id",
  requireRole("Admin", "Manager"),
  activityController.getActivityLogById
);

module.exports = router;