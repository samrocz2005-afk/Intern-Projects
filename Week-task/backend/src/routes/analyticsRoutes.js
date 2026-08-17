const express = require("express");

const analyticsController = require("../controllers/analyticsController");
const { verifyToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(verifyToken);

/*
 * GET /api/analytics/customer
 * Customer Dashboard analytics overview
 */
router.get(
  "/customer",
  requireRole("customer", "admin", "Customer", "Admin", "Manager"),
  analyticsController.getCustomerDashboardAnalytics
);

/*
 * GET /api/analytics
 * Dashboard analytics overview (Admin/Manager only)
 */
router.get(
  "/",
  requireRole("admin", "Admin", "Manager"),
  analyticsController.getDashboardAnalytics
);

// GET /api/analytics/sales
router.get(
  "/sales",
  requireRole("admin", "Admin", "Manager"),
  analyticsController.getSalesAnalytics
);

// GET /api/analytics/revenue
router.get(
  "/revenue",
  requireRole("admin", "Admin", "Manager"),
  analyticsController.getRevenueAnalytics
);

// GET /api/analytics/orders
router.get(
  "/orders",
  requireRole("admin", "Admin", "Manager"),
  analyticsController.getOrderAnalytics
);

// GET /api/analytics/products
router.get(
  "/products",
  requireRole("admin", "Admin", "Manager"),
  analyticsController.getProductAnalytics
);

router.get(
  "/customer/analytics",
  requireRole("customer", "admin", "Customer", "Admin", "Manager"),
  analyticsController.getCustomerDashboardAnalytics
);

module.exports = router;