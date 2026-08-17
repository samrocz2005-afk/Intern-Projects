const pino = require("pino");

const isProduction =
  process.env.NODE_ENV === "production";

const logger = pino({
  level:
    process.env.LOG_LEVEL ||
    (isProduction ? "info" : "debug"),

  base: {
    service: "shopping-app-api",
  },

  timestamp: pino.stdTimeFunctions.isoTime,

  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "password",
      "*.password",
      "token",
      "*.token",
      "accessToken",
      "*.accessToken",
      "refreshToken",
      "*.refreshToken",
      "apiKey",
      "*.apiKey",
      "secret",
      "*.secret",
    ],
    censor: "[REDACTED]",
  },

  serializers: {
    err: pino.stdSerializers.err,

    req: (req) => ({
      method: req.method,
      url: req.url,
      remoteAddress:
        req.ip ||
        req.socket?.remoteAddress,
    }),

    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

const logRequest = (
  req,
  res,
  responseTime
) => {
  logger.info(
    {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime,
      userId: req.user?.id,
      role: req.user?.role,
      ip: req.ip,
    },
    "HTTP request"
  );
};

const logError = (
  error,
  context = {}
) => {
  logger.error(
    {
      err: error,
      ...context,
    },
    error.message || "Application error"
  );
};

const logInfo = (
  message,
  context = {}
) => {
  logger.info(
    context,
    message
  );
};

const logWarn = (
  message,
  context = {}
) => {
  logger.warn(
    context,
    message
  );
};

const logDebug = (
  message,
  context = {}
) => {
  logger.debug(
    context,
    message
  );
};

module.exports = {
  logger,
  logRequest,
  logError,
  logInfo,
  logWarn,
  logDebug,
};