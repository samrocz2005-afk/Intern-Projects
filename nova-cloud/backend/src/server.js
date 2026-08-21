const { loadEnv } = require("./config/env");

loadEnv();

const app = require("./app");

const {
  connectDB,
  disconnectDB,
} = require("./config/db");

const {
  startCronJobs,
  stopCronJobs,
} = require("./config/cron");

const authService = require("./services/auth.service");

const PORT =
  Number(process.env.PORT) || 5000;

let server;

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

const startServer = async () => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Database
    |--------------------------------------------------------------------------
    */

    await connectDB();

    console.log("MongoDB connected");

    /*
    |--------------------------------------------------------------------------
    | Ensure Admin User
    |--------------------------------------------------------------------------
    |
    | Creates the admin from .env if it does not exist.
    | Also makes sure the admin is active.
    |
    */

    await authService.ensureAdminUser();

    console.log(
      `Admin configured: ${process.env.ADMIN_EMAIL}`
    );

    /*
    |--------------------------------------------------------------------------
    | HTTP Server
    |--------------------------------------------------------------------------
    */

    server = app.listen(
      PORT,
      () => {
        console.log(
          `Cloud API running on port ${PORT}`
        );

        console.log(
          `API: http://localhost:${PORT}/api`
        );

        console.log(
          `Health: http://localhost:${PORT}/api/health`
        );
      }
    );

    /*
    |--------------------------------------------------------------------------
    | Cron Jobs
    |--------------------------------------------------------------------------
    */

    startCronJobs();

    console.log("Cron jobs started");
  } catch (error) {
    console.error(
      "Server startup failed:",
      error
    );

    /*
     * Try to close database if startup
     * fails after connection.
     */
    try {
      await disconnectDB();
    } catch (dbError) {
      console.error(
        "Database disconnect error:",
        dbError
      );
    }

    process.exit(1);
  }
};

/*
|--------------------------------------------------------------------------
| Graceful Shutdown
|--------------------------------------------------------------------------
*/

const shutdown = async (signal) => {
  console.log(
    `\n${signal} received. Shutting down...`
  );

  try {
    /*
    |--------------------------------------------------------------------------
    | Stop Cron Jobs
    |--------------------------------------------------------------------------
    */

    stopCronJobs();

    /*
    |--------------------------------------------------------------------------
    | Stop HTTP Server
    |--------------------------------------------------------------------------
    */

    if (server) {
      await new Promise(
        (resolve, reject) => {
          server.close((error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        }
      );

      console.log(
        "HTTP server stopped"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Close MongoDB
    |--------------------------------------------------------------------------
    */

    await disconnectDB();

    console.log(
      "MongoDB connection closed"
    );

    console.log(
      "Server shutdown complete"
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Shutdown error:",
      error
    );

    process.exit(1);
  }
};

/*
|--------------------------------------------------------------------------
| Process Signals
|--------------------------------------------------------------------------
*/

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

/*
|--------------------------------------------------------------------------
| Handle Unhandled Errors
|--------------------------------------------------------------------------
*/

process.on(
  "unhandledRejection",
  (error) => {
    console.error(
      "Unhandled Promise Rejection:",
      error
    );

    shutdown("UNHANDLED_REJECTION");
  }
);

process.on(
  "uncaughtException",
  (error) => {
    console.error(
      "Uncaught Exception:",
      error
    );

    shutdown("UNCAUGHT_EXCEPTION");
  }
);

/*
|--------------------------------------------------------------------------
| Start Application
|--------------------------------------------------------------------------
*/

startServer();