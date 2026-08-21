const MESSAGES = require("../constants/messages");

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err?.message);

  let statusCode = err.statusCode || 500;

  let message = err.message || MESSAGES.COMMON.INTERNAL_SERVER_ERROR;

  /*
  |--------------------------------------------------------------------------
  | Mongoose Validation Error
  |--------------------------------------------------------------------------
  */

  if (err.name === "ValidationError") {
    statusCode = 400;

    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return res.status(400).json({
      success: false,
      message: MESSAGES.COMMON.VALIDATION_FAILED,
      errors,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | MongoDB Duplicate Key
  |--------------------------------------------------------------------------
  */

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: MESSAGES.COMMON.DUPLICATE_RESOURCE,
      fields: Object.keys(err.keyValue || {}),
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Invalid ObjectId
  |--------------------------------------------------------------------------
  */

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: err.message || MESSAGES.COMMON.INVALID_ID,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Standard Error Response
  |--------------------------------------------------------------------------
  */

  const response = {
    success: false,
    message,
  };

  /*
  |--------------------------------------------------------------------------
  | Additional Validation / Error Details
  |--------------------------------------------------------------------------
  */

  if (err.errors) {
    response.errors = err.errors;
  }

  /*
  |--------------------------------------------------------------------------
  | Development Stack
  |--------------------------------------------------------------------------
  */

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  errorHandler,
};
