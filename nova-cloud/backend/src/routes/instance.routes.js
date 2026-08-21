const express = require("express");

const router = express.Router();

const instanceController = require("../controllers/instance.controller");

const { protect } = require("../middleware/auth.middleware");

const { ownership } = require("../middleware/ownership.middleware");

const { validate } = require("../middleware/validate.middleware");

const {
  createInstanceSchema,
  updateInstanceSchema,
  instanceIdSchema,
} = require("../validators/instance.validator");

const Instance = require("../models/Instance");

/*
|--------------------------------------------------------------------------
| Instance Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET /api/instances
| Get all instances belonging to authenticated user
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  instanceController.getInstances
);

/*
|--------------------------------------------------------------------------
| POST /api/instances
| Create instance
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  validate(createInstanceSchema),
  instanceController.createInstance
);

/*
|--------------------------------------------------------------------------
| GET /api/instances/:id
| Get single instance
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  validate(instanceIdSchema),
  ownership(Instance),
  instanceController.getInstance
);

/*
|--------------------------------------------------------------------------
| PUT /api/instances/:id
| Update instance
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  validate(updateInstanceSchema),
  ownership(Instance),
  instanceController.updateInstance
);

/*
|--------------------------------------------------------------------------
| POST /api/instances/:id/start
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/start",
  protect,
  validate(instanceIdSchema),
  ownership(Instance),
  instanceController.startInstance
);

/*
|--------------------------------------------------------------------------
| POST /api/instances/:id/stop
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/stop",
  protect,
  validate(instanceIdSchema),
  ownership(Instance),
  instanceController.stopInstance
);

/*
|--------------------------------------------------------------------------
| POST /api/instances/:id/restart
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/restart",
  protect,
  validate(instanceIdSchema),
  ownership(Instance),
  instanceController.restartInstance
);

/*
|--------------------------------------------------------------------------
| DELETE /api/instances/:id
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  validate(instanceIdSchema),
  ownership(Instance),
  instanceController.deleteInstance
);

module.exports = router;