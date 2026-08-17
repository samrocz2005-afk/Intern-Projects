const express = require("express");

const campaignController = require("../controllers/campaignController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

// GET /api/campaigns
router.get(
  "/",
  campaignController.getCampaigns
);

// GET /api/campaigns/:id
router.get(
  "/:id",
  campaignController.getCampaignById
);

// POST /api/campaigns
router.post(
  "/",
  requireRole("Admin", "Manager"),
  campaignController.createCampaign
);

// PUT /api/campaigns/:id
router.put(
  "/:id",
  requireRole("Admin", "Manager"),
  campaignController.updateCampaign
);

// DELETE /api/campaigns/:id
router.delete(
  "/:id",
  requireRole("Admin"),
  campaignController.deleteCampaign
);

// PATCH /api/campaigns/:id/status
router.patch(
  "/:id/status",
  requireRole("Admin", "Manager"),
  campaignController.updateCampaignStatus
);

module.exports = router;