import { errorResponse } from "../utils/response.js";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));

    return errorResponse(
      res,
      "Validation failed",
      400,
      errors
    );
  }

  // Duplicate Key Error (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];

    return errorResponse(
      res,
      `${field} already exists`,
      409
    );
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return errorResponse(
      res,
      "Invalid resource ID",
      400
    );
  }

  // JWT Expired
  if (err.name === "TokenExpiredError") {
    return errorResponse(
      res,
      "Access token has expired",
      401
    );
  }

  // Invalid JWT
  if (err.name === "JsonWebTokenError") {
    return errorResponse(
      res,
      "Invalid access token",
      401
    );
  }

  // Custom Service Errors
  if (err.message) {
    return errorResponse(
      res,
      err.message,
      err.statusCode || 400
    );
  }

  // Unknown Error
  return errorResponse(
    res,
    "Internal Server Error",
    500
  );
};

export default errorMiddleware;