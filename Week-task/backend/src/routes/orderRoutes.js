const express = require("express");
const mongoose = require("mongoose");

const orderController = require("../controllers/orderController");
const { verifyToken, requireRole } = require("../middleware/auth");
const { createOrderValidator } = require("../validators/orderValidator");
const ApiError = require("../utils/ApiError");

const router = express.Router();

/*
 * Inline validate middleware (bypasses missing file error)
 */
const validate = (validationFunction) => {
  if (typeof validationFunction !== "function") {
    throw new TypeError("validationFunction must be a function");
  }

  return (req, res, next) => {
    try {
      const result = validationFunction({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result) {
        return next();
      }

      if (result.errors && result.errors.length > 0) {
        throw new ApiError(
          400,
          "Request validation failed",
          "VALIDATION_ERROR",
          result.errors
        );
      }

      if (result.value?.body) {
        req.body = result.value.body;
      }
      if (result.value?.params) {
        req.params = result.value.params;
      }
      if (result.value?.query) {
        req.query = result.value.query;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/*
 * All order routes require authentication.
 */
router.use(verifyToken);

/*
 * GET /api/orders
 * Search, filter and paginate orders.
 */
router.get("/", orderController.getOrders);

/*
 * GET /api/orders/:id
 */
router.get("/:id", orderController.getOrderById);

/*
 * POST /api/orders
 * Admin, Manager, and Customer can create orders.
 */
router.post(
  "/",
  requireRole("Admin", "Manager", "Customer"),
  validate(createOrderValidator),
  orderController.createOrder
);

/*
 * PUT /api/orders/:id
 * General order update.
 */
router.put(
  "/:id",
  requireRole("Admin", "Manager"),
  orderController.updateOrder
);

/*
 * PATCH /api/orders/:id/status
 * Update order status.
 */
router.patch(
  "/:id/status",
  requireRole("Admin", "Manager", "Staff"),
  orderController.updateOrderStatus
);

/*
 * PATCH /api/orders/:id/cancel
 * Cancel an order.
 */
router.patch(
  "/:id/cancel",
  requireRole("Admin", "Manager"),
  orderController.cancelOrder
);

module.exports = router;