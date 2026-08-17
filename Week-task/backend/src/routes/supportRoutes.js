const express = require("express");

const supportController = require("../controllers/supportController");
const {verifyToken,requireRole} = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/support
router.get(
  "/",
  supportController.getTickets
);

// GET /api/support/:id
router.get(
  "/:id",
  supportController.getTicketById
);

// POST /api/support
router.post(
  "/",
  supportController.createTicket
);

// PATCH /api/support/:id
router.patch(
  "/:id",
  requireRole("Admin", "Manager", "Support"),
  supportController.updateTicket
);

// PATCH /api/support/:id/status
router.patch(
  "/:id/status",
  requireRole("Admin", "Manager", "Support"),
  supportController.updateTicketStatus
);

// POST /api/support/:id/messages
router.post(
  "/:id/messages",
  requireRole("Admin", "Manager", "Support"),
  supportController.addMessage
);

module.exports = router;