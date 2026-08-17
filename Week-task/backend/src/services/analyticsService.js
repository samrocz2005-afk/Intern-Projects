const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Inventory = require("../models/Inventory");
const ApiError = require("../utils/ApiError");

const getDateRange = ({
  startDate,
  endDate,
} = {}) => {
  let start;
  let end;

  if (startDate) {
    start = new Date(startDate);

    if (Number.isNaN(start.getTime())) {
      throw new ApiError(
        400,
        "Invalid start date",
        "INVALID_START_DATE"
      );
    }
  }

  if (endDate) {
    end = new Date(endDate);

    if (Number.isNaN(end.getTime())) {
      throw new ApiError(
        400,
        "Invalid end date",
        "INVALID_END_DATE"
      );
    }

    end.setHours(23, 59, 59, 999);
  }

  return {
    ...(start && {
      $gte: start,
    }),

    ...(end && {
      $lte: end,
    }),
  };
};

const getCustomerOverview = async (userId, { startDate, endDate } = {}) => {
  const orderDateFilter = getDateRange({
    startDate,
    endDate,
  });

  const customerObjectId = mongoose.Types.ObjectId.isValid(userId)
    ? new mongoose.Types.ObjectId(userId)
    : userId;

  const orderMatch = {
    customer: customerObjectId, 
  };

  if (Object.keys(orderDateFilter).length) {
    orderMatch.createdAt = orderDateFilter;
  }

  const [
    salesResult,
    totalOrders,
    productCount,
    recentOrders,
  ] = await Promise.all([
    Order.aggregate([
      {
        $match: orderMatch,
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total",
          },
          totalOrders: {
            $sum: 1,
          },
        },
      },
    ]),

    Order.countDocuments(orderMatch),

    Product.countDocuments(),

    // Fetch the recent orders for this customer (last 5)
    Order.find(orderMatch)
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
  ]);

  const sales = salesResult[0] || {
    totalRevenue: 0,
    totalOrders: 0,
  };

  return {
    myOrders: totalOrders || 0,
    myTotalSpent: sales.totalRevenue || 0,
    wishlistCount: 0,
    availableProducts: productCount || 0,
    recentOrders: recentOrders || [],
  };
};

const getOverview = async ({
  startDate,
  endDate,
} = {}) => {
  const orderDateFilter =
    getDateRange({
      startDate,
      endDate,
    });

  const orderMatch = {};

  if (Object.keys(orderDateFilter).length) {
    orderMatch.createdAt =
      orderDateFilter;
  }

  orderMatch.status = {
    $in: [
      "Completed",
      "Delivered",
    ],
  };

  const [
    salesResult,
    totalOrders,
    totalCustomers,
    productCount,
    lowStockCount,
  ] = await Promise.all([
    Order.aggregate([
      {
        $match: orderMatch,
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total",
          },
          totalOrders: {
            $sum: 1,
          },
        },
      },
    ]),

    Order.countDocuments(
      orderMatch
    ),

    Customer.countDocuments(),

    Product.countDocuments(),

    Inventory.countDocuments({
      $expr: {
        $lte: [
          "$quantity",
          "$lowStockThreshold",
        ],
      },
    }),
  ]);

  const sales = salesResult[0] || {
    totalRevenue: 0,
    totalOrders: 0,
  };

  return {
    totalSales: sales.totalRevenue,
    totalRevenue: sales.totalRevenue,
    totalOrders,
    totalCustomers,
    productCount,
    lowStockCount,
  };
};

const getSalesTrend = async ({
  startDate,
  endDate,
  interval = "day",
} = {}) => {
  const dateFilter =
    getDateRange({
      startDate,
      endDate,
    });

  const match = {
    status: {
      $in: [
        "Completed",
        "Delivered",
      ],
    },
  };

  if (Object.keys(dateFilter).length) {
    match.createdAt = dateFilter;
  }

  const dateFormat =
    interval === "month"
      ? "%Y-%m"
      : interval === "week"
      ? "%G-W%V"
      : "%Y-%m-%d";

  return Order.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: dateFormat,
            date: "$createdAt",
          },
        },
        revenue: {
          $sum: "$total",
        },
        orders: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        revenue: 1,
        orders: 1,
      },
    },
  ]);
};

const getOrderStatistics = async ({
  startDate,
  endDate,
} = {}) => {
  const dateFilter =
    getDateRange({
      startDate,
      endDate,
    });

  const match = {};

  if (Object.keys(dateFilter).length) {
    match.createdAt = dateFilter;
  }

  return Order.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
        revenue: {
          $sum: "$total",
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
        revenue: 1,
      },
    },
  ]);
};

const getTopProducts = async ({
  startDate,
  endDate,
  limit = 10,
} = {}) => {
  const dateFilter =
    getDateRange({
      startDate,
      endDate,
    });

  const match = {
    status: {
      $in: [
        "Completed",
        "Delivered",
      ],
    },
  };

  if (Object.keys(dateFilter).length) {
    match.createdAt = dateFilter;
  }

  const parsedLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  return Order.aggregate([
    {
      $match: match,
    },
    {
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.product",
        quantity: {
          $sum: "$items.quantity",
        },
        revenue: {
          $sum: {
            $multiply: [
              "$items.quantity",
              "$items.price",
            ],
          },
        },
      },
    },
    {
      $sort: {
        quantity: -1,
      },
    },
    {
      $limit: parsedLimit,
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: {
        path: "$product",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        name: "$product.name",
        image: "$product.image",
        quantity: 1,
        revenue: 1,
      },
    },
  ]);
};

module.exports = {
  getOverview,
  getSalesTrend,
  getOrderStatistics,
  getTopProducts,
  getCustomerOverview,
};