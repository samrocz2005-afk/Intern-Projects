const express = require("express");

const integrationController = require("../controllers/integrationController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/integrations
router.get(
  "/",
  requireRole("Admin", "Manager"),
  integrationController.getIntegrations
);

// GET /api/integrations/:id
router.get(
  "/:id",
  requireRole("Admin", "Manager"),
  integrationController.getIntegrationById
);

// POST /api/integrations
router.post(
  "/",
  requireRole("Admin"),
  integrationController.createIntegration
);

// PUT /api/integrations/:id
router.put(
  "/:id",
  requireRole("Admin"),
  integrationController.updateIntegration
);

// PATCH /api/integrations/:id/status
router.patch(
  "/:id/status",
  requireRole("Admin"),
  integrationController.updateIntegrationStatus
);

// DELETE /api/integrations/:id
router.delete(
  "/:id",
  requireRole("Admin"),
  integrationController.deleteIntegration
);

module.exports = router;