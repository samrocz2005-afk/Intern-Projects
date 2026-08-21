const express = require("express");

const router = express.Router();

const networkController = require("../controllers/network.controller");

const { protect } = require("../middleware/auth.middleware");

const { adminOnly } = require("../middleware/admin.middleware");

const { validate } = require("../middleware/validate.middleware");

const {
  createNetworkSchema,
  updateNetworkSchema,
  networkIdSchema,
  listNetworksSchema,
} = require("../validators/network.validator");

/*
|--------------------------------------------------------------------------
| Network Routes
|--------------------------------------------------------------------------
|
| ADMIN:
|   Create
|   Update
|   Delete
|   View
|
| USER:
|   View only
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| GET /api/networks
| ADMIN + USER
|--------------------------------------------------------------------------
|
| Users can view admin-created active networks.
|
*/

router.get(
  "/",
  protect,
  validate(listNetworksSchema),
  networkController.getNetworks
);


/*
|--------------------------------------------------------------------------
| POST /api/networks
| ADMIN ONLY
|--------------------------------------------------------------------------
|
| Admin creates the network and sets pricing.
|
*/

router.post(
  "/",
  protect,
  adminOnly,
  validate(createNetworkSchema),
  networkController.createNetwork
);


/*
|--------------------------------------------------------------------------
| GET /api/networks/:id
| ADMIN + USER
|--------------------------------------------------------------------------
|
| Users can view any active network.
|
*/

router.get(
  "/:id",
  protect,
  validate(networkIdSchema),
  networkController.getNetwork
);


/*
|--------------------------------------------------------------------------
| PUT /api/networks/:id
| ADMIN ONLY
|--------------------------------------------------------------------------
|
| Admin can modify:
|   - name
|   - CIDR
|   - gateway
|   - DNS
|   - type
|   - status
|   - hourlyPrice
|   - monthlyPrice
|   - default
|
*/

router.put(
  "/:id",
  protect,
  adminOnly,
  validate(updateNetworkSchema),
  networkController.updateNetwork
);


/*
|--------------------------------------------------------------------------
| DELETE /api/networks/:id
| ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  adminOnly,
  validate(networkIdSchema),
  networkController.deleteNetwork
);


module.exports = router;