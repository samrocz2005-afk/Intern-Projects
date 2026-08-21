const express = require("express");

const router = express.Router();

const storageController = require("../controllers/storage.controller");

const { protect } = require("../middleware/auth.middleware");

const { ownership } = require("../middleware/ownership.middleware");

const { validate } = require("../middleware/validate.middleware");

const {
  createStorageSchema,
  updateStorageSchema,
  storageIdSchema,
  attachStorageSchema,
} = require("../validators/storage.validator");

const Storage = require("../models/Storage");

/*
|--------------------------------------------------------------------------
| Storage Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET /api/storage
| Get storage resources belonging to authenticated user
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  protect,
  storageController.getStorage
);

/*
|--------------------------------------------------------------------------
| POST /api/storage
| Create storage
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  validate(createStorageSchema),
  storageController.createStorage
);

/*
|--------------------------------------------------------------------------
| GET /api/storage/:id
| Get single storage
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  validate(storageIdSchema),
  ownership(Storage),
  storageController.getStorageById
);

/*
|--------------------------------------------------------------------------
| PUT /api/storage/:id
| Update storage
|--------------------------------------------------------------------------
*/

router.put(
  "/:id",
  protect,
  validate(updateStorageSchema),
  ownership(Storage),
  storageController.updateStorage
);

/*
|--------------------------------------------------------------------------
| Attach / Detach
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| POST /api/storage/:id/attach
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/attach",
  protect,
  validate(attachStorageSchema),
  ownership(Storage),
  storageController.attachStorage
);

/*
|--------------------------------------------------------------------------
| POST /api/storage/:id/detach
|--------------------------------------------------------------------------
*/

router.post(
  "/:id/detach",
  protect,
  validate(storageIdSchema),
  ownership(Storage),
  storageController.detachStorage
);

/*
|--------------------------------------------------------------------------
| DELETE /api/storage/:id
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  validate(storageIdSchema),
  ownership(Storage),
  storageController.deleteStorage
);

module.exports = router;