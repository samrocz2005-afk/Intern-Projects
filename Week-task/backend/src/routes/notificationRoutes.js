const express = require("express");

const notificationController = require("../controllers/notificationController");

const {
  verifyToken,
  requireRole,
} = require("../middleware/auth");

const router = express.Router();

/*
 * ==================================================
 * ALL NOTIFICATION ROUTES REQUIRE AUTHENTICATION
 * ==================================================
 */
router.use(verifyToken);

/*
 * ==================================================
 * GET ALL NOTIFICATIONS
 *
 * Admin    -> all notifications
 * Customer -> own notifications
 * Staff    -> own notifications
 * ==================================================
 */
router.get(
  "/",
  notificationController.getNotifications
);

/*
 * ==================================================
 * CREATE NOTIFICATION
 *
 * ADMIN ONLY
 * ==================================================
 */
router.post(
  "/",
  requireRole("admin"),
  notificationController.createNotification
);

/*
 * ==================================================
 * MARK ALL NOTIFICATIONS AS READ
 *
 * Customer -> own notifications
 * Staff    -> own notifications
 * ==================================================
 */
router.patch(
  "/read-all",
  notificationController.markAllAsRead
);

/*
 * ==================================================
 * MARK SINGLE NOTIFICATION AS READ
 *
 * Customer -> own notification
 * Staff    -> own notification
 * ==================================================
 */
router.patch(
  "/:id/read",
  notificationController.markAsRead
);

/*
 * ==================================================
 * GET SINGLE NOTIFICATION
 *
 * /api/notifications/:id
 *
 * Used by:
 * NotificationDetails.jsx
 *
 * Admin    -> notification
 * Customer -> own notification only
 * Staff    -> own notification only
 * ==================================================
 */
router.get(
  "/:id",
  notificationController.getNotificationById
);

/*
 * ==================================================
 * DELETE NOTIFICATION
 *
 * Customer -> own notification
 * Staff    -> own notification
 * ==================================================
 */
router.delete(
  "/:id",
  notificationController.deleteNotification
);

module.exports = router;