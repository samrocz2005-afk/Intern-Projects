const express = require("express");

const router = express.Router();

const loadBalancerController = require("../controllers/loadBalancer.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const {ownership} = require("../middleware/ownership.middleware");

const {validate} = require("../middleware/validate.middleware");

const {LoadBalancer} = require("../models/LoadBalancer");

const {
  createLoadBalancerSchema,
  loadBalancerIdSchema,
  addBackendSchema,
  removeBackendSchema,
  updateBackendHealthSchema,
} = require("../validators/loadBalancer.validator");

/*
|--------------------------------------------------------------------------
| Load Balancer Routes
|--------------------------------------------------------------------------
*/

// GET /api/load-balancers
router.get(
  "/",
  protect,
  loadBalancerController.getLoadBalancers
);

// POST /api/load-balancers
router.post(
  "/",
  protect,
  validate(createLoadBalancerSchema),
  loadBalancerController.createLoadBalancer
);

// GET /api/load-balancers/:id
router.get(
  "/:id",
  protect,
  validate(loadBalancerIdSchema),
  ownership(LoadBalancer),
  loadBalancerController.getLoadBalancer
);

/*
|--------------------------------------------------------------------------
| Backend Instances
|--------------------------------------------------------------------------
*/

// POST /api/load-balancers/:id/backends
router.post(
  "/:id/backends",
  protect,
  validate(addBackendSchema),
  ownership(LoadBalancer),
  loadBalancerController.addBackendInstance
);

// DELETE /api/load-balancers/:id/backends/:backendId
router.delete(
  "/:id/backends/:backendId",
  protect,
  validate(removeBackendSchema),
  ownership(LoadBalancer),
  loadBalancerController.removeBackendInstance
);

// PATCH /api/load-balancers/:id/backends/:backendId/health
router.patch(
  "/:id/backends/:backendId/health",
  protect,
  validate(updateBackendHealthSchema),
  ownership(LoadBalancer),
  loadBalancerController.updateBackendHealth
);

// DELETE /api/load-balancers/:id
router.delete(
  "/:id",
  protect,
  validate(loadBalancerIdSchema),
  ownership(LoadBalancer),
  loadBalancerController.deleteLoadBalancer
);

module.exports = router;