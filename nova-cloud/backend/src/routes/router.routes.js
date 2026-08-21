const express = require("express");

const router = express.Router();

const routerController = require("../controllers/router.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const {ownership} = require("../middleware/ownership.middleware");

const {validate} = require("../middleware/validate.middleware");

const {RouterModel} = require("../models/Router");

const {
  createRouterSchema,
  updateRouterSchema,
  routerIdSchema,
  connectNetworkSchema,
} = require("../validators/router.validator");

/*
|--------------------------------------------------------------------------
| Router Routes
|--------------------------------------------------------------------------
*/

// GET /api/routers
router.get(
  "/",
  protect,
  routerController.getRouters
);

// POST /api/routers
router.post(
  "/",
  protect,
  validate(createRouterSchema),
  routerController.createRouter
);

// GET /api/routers/:id
router.get(
  "/:id",
  protect,
  validate(routerIdSchema),
  ownership(RouterModel),
  routerController.getRouter
);

// PUT /api/routers/:id
router.put(
  "/:id",
  protect,
  validate(updateRouterSchema),
  ownership(RouterModel),
  routerController.updateRouter
);

/*
|--------------------------------------------------------------------------
| Network Connection
|--------------------------------------------------------------------------
*/

// POST /api/routers/:id/networks
router.post(
  "/:id/networks",
  protect,
  validate(connectNetworkSchema),
  ownership(RouterModel),
  routerController.connectNetwork
);

// DELETE /api/routers/:id/networks/:networkId
router.delete(
  "/:id/networks/:networkId",
  protect,
  validate(routerIdSchema),
  ownership(RouterModel),
  routerController.disconnectNetwork
);

// DELETE /api/routers/:id
router.delete(
  "/:id",
  protect,
  validate(routerIdSchema),
  ownership(RouterModel),
  routerController.deleteRouter
);

module.exports = router;