const dotenv = require("dotenv");

dotenv.config();

const requiredEnv = [
  "MONGO_URI",
  "JWT_SECRET",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
];

const validateEnv = () => {
  const missing = requiredEnv.filter(
    (key) => !process.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(
        ", "
      )}`
    );
  }

  if (
    process.env.JWT_SECRET.length < 32
  ) {
    throw new Error(
      "JWT_SECRET must be at least 32 characters"
    );
  }

  if (
    process.env.PORT &&
    Number.isNaN(Number(process.env.PORT))
  ) {
    throw new Error(
      "PORT must be a valid number"
    );
  }
};

const loadEnv = () => {
  validateEnv();

  return {
    nodeEnv:
      process.env.NODE_ENV || "development",

    port: Number(
      process.env.PORT || 5000
    ),

    mongoUri: process.env.MONGO_URI,

    jwtSecret: process.env.JWT_SECRET,

    jwtExpiresIn:
      process.env.JWT_EXPIRES_IN || "1d",

    adminEmail:
      process.env.ADMIN_EMAIL,

    adminPassword:
      process.env.ADMIN_PASSWORD,

    adminName:
      process.env.ADMIN_NAME ||
      "NovaCloud Admin",

    billingTimezone:
      process.env.BILLING_TIMEZONE ||
      "Asia/Kolkata",
  };
};

module.exports = {
  loadEnv,
};