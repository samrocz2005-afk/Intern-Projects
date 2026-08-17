const asyncHandler = require("../utils/asyncHandler");
const analyticsService = require("../services/analyticsService");

// GET /api/analytics
const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const overview = await analyticsService.getOverview({ startDate, endDate });
  const trends = await analyticsService.getSalesTrend({ startDate, endDate, interval: "month" });

  const formattedTrends = (trends || []).map((item, index) => ({
    key: String(index + 1),
    month: item.date,
    orders: item.orders,
    revenue: item.revenue,
    growth: 12.5,
  }));

  res.status(200).json({
    success: true,
    message: "Dashboard analytics fetched successfully",
    data: {
      totalRevenue: overview?.totalRevenue || 0,
      totalOrders: overview?.totalOrders || 0,
      totalCustomers: overview?.totalCustomers || 0,
      productCount: overview?.productCount || 0,
      lowStockCount: overview?.lowStockCount || 0,
      recentOrders: overview?.recentOrders || [],
      stats: {
        totalRevenue: overview?.totalRevenue || 0,
        totalOrders: overview?.totalOrders || 0,
        customers: overview?.totalCustomers || 0,
        revenueGrowth: 16.7,
      },
      trends: formattedTrends,
    },
  });
});

const getCustomerDashboardAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getCustomerOverview(req.user.id, req.query);

  res.status(200).json({
    success: true,
    message: "Customer dashboard analytics fetched successfully",
    data: analytics,
  });
});

const getSalesAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getSalesTrend(req.query);

  res.status(200).json({
    success: true,
    message: "Sales analytics fetched successfully",
    data: analytics,
  });
});

const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getOverview(req.query);

  res.status(200).json({
    success: true,
    message: "Revenue analytics fetched successfully",
    data: analytics,
  });
});

const getOrderAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getOrderStatistics(req.query);

  res.status(200).json({
    success: true,
    message: "Order analytics fetched successfully",
    data: analytics,
  });
});

const getProductAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getTopProducts(req.query);

  res.status(200).json({
    success: true,
    message: "Product analytics fetched successfully",
    data: analytics,
  });
});

module.exports = {
  getDashboardAnalytics,
  getCustomerDashboardAnalytics,
  getSalesAnalytics,
  getRevenueAnalytics,
  getOrderAnalytics,
  getProductAnalytics,
};