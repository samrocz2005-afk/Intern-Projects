const express = require("express");

const router = express.Router();

const flavorController = require("../controllers/flavor.controller");

const { protect } = require("../middleware/auth.middleware");

const { authorize } = require("../middleware/role.middleware");

const { validate } = require("../middleware/validate.middleware");

const {
  flavorIdSchema,
  createFlavorSchema,
  updateFlavorSchema,
  listFlavorsSchema,
} = require("../validators/flavor.validator");

/*
|--------------------------------------------------------------------------
| Public / Authenticated Flavor Routes
|--------------------------------------------------------------------------
*/

// GET /api/flavors
// Authenticated users can view available flavors
router.get(
  "/",
  protect,
  validate(listFlavorsSchema),
  flavorController.getFlavors
);

// GET /api/flavors/:id
router.get(
  "/:id",
  protect,
  validate(flavorIdSchema),
  flavorController.getFlavor
);

/*
|--------------------------------------------------------------------------
| Admin Flavor Management
|--------------------------------------------------------------------------
*/

// POST /api/flavors
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(createFlavorSchema),
  flavorController.createFlavor
);

// PUT /api/flavors/:id
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateFlavorSchema),
  flavorController.updateFlavor
);

// PATCH /api/flavors/:id/status
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  validate(flavorIdSchema),
  flavorController.updateFlavorStatus
);

// DELETE /api/flavors/:id
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validate(flavorIdSchema),
  flavorController.deleteFlavor
);

module.exports = router;