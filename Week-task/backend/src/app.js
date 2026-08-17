const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const pinoHttp = require("pino-http");

const { logger } = require("./utils/logger");

const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const discountRoutes = require("./routes/discountRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const staffRoutes = require("./routes/staffRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const supportRoutes = require("./routes/supportRoutes");
const shippingRoutes = require("./routes/shippingRoutes");
const returnRoutes = require("./routes/returnRoutes");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const profileRoutes = require("./routes/profileRoutes")

const app = express();

/*
 * --------------------------------------------------
 * Security
 * --------------------------------------------------
 */

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

/*
 * --------------------------------------------------
 * CORS
 * --------------------------------------------------
 */

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:3000"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
    ],
  })
);

/*
 * --------------------------------------------------
 * Request Logging
 * --------------------------------------------------
 */

app.use(
  pinoHttp({
    logger,

    autoLogging: {
      ignore: (req) => req.url === "/api/health",
    },

    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        remoteAddress: req.remoteAddress,
      }),

      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  })
);

/*
 * --------------------------------------------------
 * Body Parsing
 * --------------------------------------------------
 */

app.use(
  express.json({
    limit: "1mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

/*
 * --------------------------------------------------
 * Health Check
 * --------------------------------------------------
 */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shopping API is healthy",
    data: {
      service: "shopping-app-api",
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    },
  });
});

/*
 * --------------------------------------------------
 * API Routes
 * --------------------------------------------------
 */

// Authentication
app.use("/api/auth", authRoutes);

// Products
app.use("/api/products", productRoutes);

// Categories
app.use("/api/categories", categoryRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Customers
app.use("/api/customers", customerRoutes);

// Inventory
app.use("/api/inventory", inventoryRoutes);

// Discounts
app.use("/api/discounts", discountRoutes);

// Transactions
app.use("/api/transactions", transactionRoutes);

// Reviews
app.use("/api/reviews", reviewRoutes);

// Campaigns
app.use("/api/campaigns", campaignRoutes);

// Wishlists
app.use("/api/wishlists", wishlistRoutes);

// Vendors
app.use("/api/vendors", vendorRoutes);

// Staff
app.use("/api/staff", staffRoutes);

// Integrations
app.use("/api/integrations", integrationRoutes);

// Support
app.use("/api/support", supportRoutes);

// Shipping
app.use("/api/shipping", shippingRoutes);

// Returns
app.use("/api/returns", returnRoutes);

// Activity Logs
app.use("/api/activity-logs", activityRoutes);

// Notifications
app.use("/api/notifications", notificationRoutes);

// Analytics
app.use("/api/analytics", analyticsRoutes);

// Settings
app.use("/api/settings", settingsRoutes);

app.use("/api/profile", profileRoutes);
/*
 * --------------------------------------------------
 * 404 Handler
 * --------------------------------------------------
 */

app.use(notFound);

/*
 * --------------------------------------------------
 * Centralized Error Handler
 * --------------------------------------------------
 */

app.use(errorHandler);

module.exports = app;