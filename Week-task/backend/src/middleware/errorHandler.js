const mongoose = require("mongoose");

const ApiError = require("../utils/ApiError");
const { logError } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  /*
   * Log the complete error internally.
   * Sensitive fields are redacted by the logger.
   */
  logError(err, {
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.id,
    ip: req.ip,
  });

  let statusCode = 500;
  let message = "Internal server error";
  let errorCode = "INTERNAL_SERVER_ERROR";
  let details = null;

  /*
   * Custom application error
   * created using ApiError.
   */
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.code || "APPLICATION_ERROR";
    details = err.details || null;
  }

  /*
   * Mongoose validation error
   */
  else if (
    err instanceof mongoose.Error.ValidationError
  ) {
    statusCode = 400;
    errorCode = "VALIDATION_ERROR";

    const validationErrors = Object.values(
      err.errors
    ).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    message = "Request validation failed";
    details = validationErrors;
  }

  /*
   * Invalid MongoDB ObjectId
   */
  else if (
    err instanceof mongoose.Error.CastError
  ) {
    statusCode = 400;
    errorCode = "INVALID_ID";

    message = `Invalid ${err.path}`;
  }

  /*
   * MongoDB duplicate key error
   */
  else if (err.code === 11000) {
    statusCode = 409;
    errorCode = "DUPLICATE_RESOURCE";

    const duplicateFields = Object.keys(
      err.keyPattern || err.keyValue || {}
    );

    if (duplicateFields.length > 0) {
      message = `${duplicateFields.join(
        ", "
      )} already exists`;
    } else {
      message = "Duplicate resource";
    }
  }

  /*
   * JWT errors
   */
  else if (
    err.name === "JsonWebTokenError"
  ) {
    statusCode = 401;
    errorCode = "INVALID_TOKEN";
    message = "Invalid authentication token";
  }

  /*
   * Expired JWT
   */
  else if (
    err.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    errorCode = "TOKEN_EXPIRED";
    message =
      "Authentication token has expired";
  }

  /*
   * JSON/body parsing error
   *
   * Express's express.json() can throw this
   * when malformed JSON is received.
   */
  else if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    statusCode = 400;
    errorCode = "INVALID_JSON";
    message = "Invalid JSON request body";
  }

  /*
   * Production:
   * Never expose unexpected internal error details.
   */
  if (
    statusCode >= 500 &&
    process.env.NODE_ENV === "production"
  ) {
    statusCode = 500;
    message = "Internal server error";
    errorCode = "INTERNAL_SERVER_ERROR";
    details = null;
  }

  const response = {
    success: false,
    message,
    error: errorCode,
  };

  /*
   * Only include validation details when available.
   */
  if (details) {
    response.details = details;
  }

  /*
   * Development-only debugging information.
   * Never expose this in production.
   */
  if (
    process.env.NODE_ENV !== "production" &&
    statusCode >= 500
  ) {
    response.stack = err.stack;
  }

  return res
    .status(statusCode)
    .json(response);
};

module.exports = errorHandler;