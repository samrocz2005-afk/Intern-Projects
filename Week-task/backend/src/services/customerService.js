const Customer = require("../models/Customer");
const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");

const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const getCustomers = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const pagination = getPagination(page, limit);

  const filter = {};

  if (search?.trim()) {
    const searchRegex = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    filter.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ];
  }

  if (status) {
    filter.status = status;
  }

  const allowedSortFields = [
    "createdAt",
    "firstName",
    "lastName",
    "email",
    "updatedAt",
  ];

  const safeSortBy = allowedSortFields.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safeSortOrder = sortOrder === "asc" ? 1 : -1;

  const [customers, total] = await Promise.all([
    Customer.find(filter)
      .select("-password")
      .sort({
        [safeSortBy]: safeSortOrder,
      })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    Customer.countDocuments(filter),
  ]);

  /*
   * Get order statistics for every customer
   */
  const customerIds = customers.map(
    (customer) => customer._id
  );

  const orderStatistics = await Order.aggregate([
    {
      $match: {
        customer: {
          $in: customerIds,
        },
      },
    },
    {
      $group: {
        _id: "$customer",

        orders: {
          $sum: 1,
        },

        totalSpent: {
          $sum: "$total",
        },
      },
    },
  ]);

  /*
   * Convert order statistics into a Map
   */
  const statisticsMap = new Map(
    orderStatistics.map((item) => [
      item._id.toString(),
      {
        orders: item.orders,
        totalSpent: item.totalSpent,
      },
    ])
  );

  /*
   * Format customer response for frontend
   */
  const formattedCustomers = customers.map(
    (customer) => {
      const statistics = statisticsMap.get(
        customer._id.toString()
      ) || {
        orders: 0,
        totalSpent: 0,
      };

      return {
        _id: customer._id,

        name: `${customer.firstName} ${customer.lastName}`.trim(),

        firstName: customer.firstName,

        lastName: customer.lastName,

        email: customer.email,

        phone: customer.phone || "N/A",

        orders: statistics.orders,

        totalSpent: statistics.totalSpent,

        status: customer.status,
      };
    }
  );

  return {
    customers: formattedCustomers,

    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(
        total / pagination.limit
      ),
    },
  };
};
const getCustomerById = async (customerId) => {
  const customer = await Customer.findById(customerId)
    .select("-password")
    .lean();

  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found",
      "CUSTOMER_NOT_FOUND"
    );
  }

  // 1. Fetch all orders for this customer and populate products inside items
  const orders = await Order.find({ customer: customerId })
    .sort({ createdAt: -1 })
    .populate("items.product")
    .lean();

  // 2. Extract and flatten products purchased from these orders
  const products = [];
  orders.forEach((order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item) => {
        products.push({
          ...item,
          // Attach order context if needed by frontend
          orderId: order._id,
          orderDate: order.createdAt,
          status: order.status,
        });
      });
    }
  });

  // 3. Compute statistics dynamically
  const totalOrders = orders.length;
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.total || 0),
    0
  );

  return {
    ...customer,
    orders,
    products,
    totalOrders,
    totalSpent,
  };
};

const createCustomer = async (customerData) => {
  const existingCustomer =
    await Customer.findOne({
      $or: [
        {
          email: customerData.email
            ?.toLowerCase(),
        },
        {
          phone: customerData.phone,
        },
      ],
    }).lean();

  if (existingCustomer) {
    throw new ApiError(
      409,
      "Customer with this email or phone already exists",
      "CUSTOMER_ALREADY_EXISTS"
    );
  }

  const customer =
    await Customer.create(customerData);

  const result =
    customer.toObject();

  delete result.password;

  return result;
};

const updateCustomer = async (
  customerId,
  updateData
) => {
  if (updateData.email) {
    updateData.email =
      updateData.email.toLowerCase();

    const existingCustomer =
      await Customer.findOne({
        email: updateData.email,
        _id: {
          $ne: customerId,
        },
      }).lean();

    if (existingCustomer) {
      throw new ApiError(
        409,
        "Email is already in use",
        "EMAIL_ALREADY_EXISTS"
      );
    }
  }

  const customer =
    await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-password")
      .lean();

  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found",
      "CUSTOMER_NOT_FOUND"
    );
  }

  return customer;
};

const updateCustomerStatus = async (
  customerId,
  isActive
) => {
  const customer =
    await Customer.findByIdAndUpdate(
      customerId,
      {
        $set: {
          isActive,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-password")
      .lean();

  if (!customer) {
    throw new ApiError(
      404,
      "Customer not found",
      "CUSTOMER_NOT_FOUND"
    );
  }

  return customer;
};

const getCustomerOrderHistory = async (
  customerId,
  {
    page = 1,
    limit = 10,
  } = {}
) => {
  const customerExists =
    await Customer.exists({
      _id: customerId,
    });

  if (!customerExists) {
    throw new ApiError(
      404,
      "Customer not found",
      "CUSTOMER_NOT_FOUND"
    );
  }

  const pagination =
    getPagination(page, limit);

  const filter = {
    customer: customerId,
  };

  const [orders, total] =
    await Promise.all([
      Order.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

  return {
    orders,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(
        total / pagination.limit
      ),
    },
  };
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  updateCustomerStatus,
  getCustomerOrderHistory,
};