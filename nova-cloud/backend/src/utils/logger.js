const winston = require("winston");

const { combine, timestamp, printf } =
  winston.format;

const logFormat = printf(
  ({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  }
);

const logger = winston.createLogger({
  level: "info",

  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),

  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;