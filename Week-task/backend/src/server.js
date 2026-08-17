const app = require("./app");
const connectDB = require("./config/db");

const { logger } = require("./utils/logger");

const PORT = Number(process.env.PORT || 5000);

const NODE_ENV = process.env.NODE_ENV || "development";

let server;

const startServer = async () => {
  try {

    await connectDB();

    server = app.listen(PORT, () => {
      logger.info(
        {
          port: PORT,
          environment: NODE_ENV,
        },
        `Shopping API running on port ${PORT}`
      );
    });
  } catch (error) {
    logger.error(
      {
        err: error,
      },
      "Failed to start server"
    );

    process.exit(1);
  }
};

/*
 * --------------------------------------------------
 * Graceful Shutdown
 * --------------------------------------------------
 */

const shutdown = async (signal) => {
  logger.info(
    `${signal} received. Starting graceful shutdown...`
  );

  if (!server) {
    process.exit(0);
  }

  server.close(() => {
    logger.info("HTTP server closed");

    process.exit(0);
  });

  /*
   * Force shutdown if existing connections
   * don't close within 10 seconds.
   */

  setTimeout(() => {
    logger.error("Forced shutdown after timeout");

    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("SIGINT", () => shutdown("SIGINT"));

/*
 * --------------------------------------------------
 * Unexpected Errors
 * --------------------------------------------------
 */

process.on("uncaughtException", (error) => {
  logger.error(
    {
      err: error,
    },
    "Uncaught exception"
  );

  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error(
    {
      err: reason,
    },
    "Unhandled promise rejection"
  );

  process.exit(1);
});

/*
 * --------------------------------------------------
 * Start Application
 * --------------------------------------------------
 */

startServer();