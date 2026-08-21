const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { apiLogger } = require("./middleware/logger.middleware");

const {
  errorHandler,
} = require("./middleware/error.middleware");

const {
  apiRateLimiter,
  authRateLimiter,
} = require("./middleware/rateLimit.middleware");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const flavorRoutes = require("./routes/flavor.routes");
const instanceRoutes = require("./routes/instance.routes");
const networkRoutes = require("./routes/network.routes");
const storageRoutes = require("./routes/storage.routes");
const routerRoutes = require("./routes/router.routes");
const loadBalancerRoutes = require("./routes/loadBalancer.routes");
const billingRoutes = require("./routes/billing.routes");

const app = express();

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },

    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "http://localhost:5000",
          "http://127.0.0.1:5000",
        ],

        connectSrc: [
          "'self'",
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "http://localhost:5000",
          "http://127.0.0.1:5000",
        ],

        scriptSrc: ["'self'"],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
        ],

        fontSrc: [
          "'self'",
          "data:",
        ],

        objectSrc: ["'none'"],
      },
    },
  })
);

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(
    process.env.FRONTEND_URL
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      /*
      |----------------------------------------------------------------------
      | Allow requests without Origin
      |----------------------------------------------------------------------
      */

      if (!origin) {
        return callback(null, true);
      }

      /*
      |----------------------------------------------------------------------
      | Check Allowed Origin
      |----------------------------------------------------------------------
      */

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `CORS blocked origin: ${origin}`
        )
      );
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
    ],
  })
);

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
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
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/

if (process.env.NODE_ENV !== "test") {
  app.use(apiLogger);
}

/*
|--------------------------------------------------------------------------
| API Rate Limiting
|--------------------------------------------------------------------------
*/

app.use(
  "/api",
  apiRateLimiter
);

app.use(
  "/api/auth",
  authRateLimiter
);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get(
  "/api/health",
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Cloud API is running",
      timestamp: new Date().toISOString(),
    });
  }
);

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/flavors",
  flavorRoutes
);

app.use(
  "/api/instances",
  instanceRoutes
);

app.use(
  "/api/networks",
  networkRoutes
);

app.use(
  "/api/storage",
  storageRoutes
);

app.use(
  "/api/routers",
  routerRoutes
);

app.use(
  "/api/load-balancers",
  loadBalancerRoutes
);

app.use(
  "/api/billing",
  billingRoutes
);

/*
|--------------------------------------------------------------------------
| 404
|--------------------------------------------------------------------------
*/

app.use(
  (req, res) => {
    return res.status(404).json({
      success: false,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

module.exports = app;