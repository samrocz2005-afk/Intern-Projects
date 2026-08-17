const express = require("express");

const customerController = require("../controllers/customerController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

/*
 * All customer routes require authentication.
 */
router.use(verifyToken);

/*
 * GET /api/customers
 * Search and paginate customers.
 */
router.get("/", customerController.getCustomers);

/*
 * GET /api/customers/:id
 */
router.get("/:id", customerController.getCustomerById);

/*
 * GET /api/customers/:id/orders
 * Customer order history.
 */
router.get(
  "/:id/orders",
  customerController.getCustomerOrders
);

/*
 * PUT /api/customers/:id
 * Admin and Manager can update customer information.
 */
router.put(
  "/:id",
  requireRole("Admin", "Manager"),
  customerController.updateCustomer
);

/*
 * PATCH /api/customers/:id/status
 * Activate/deactivate customer.
 */
router.patch(
  "/:id/status",
  requireRole("Admin", "Manager"),
  customerController.toggleCustomerStatus
);

module.exports = router;