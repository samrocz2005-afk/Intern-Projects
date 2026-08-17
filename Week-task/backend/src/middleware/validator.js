const ApiError = require("../utils/ApiError");

const validate = (validationFunction) => {
  if (typeof validationFunction !== "function") {
    throw new TypeError(
      "validationFunction must be a function"
    );
  }

  return (req, res, next) => {
    try {
      const result = validationFunction({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      if (!result) {
        return next();
      }

      if (
        result.errors &&
        result.errors.length > 0
      ) {
        throw new ApiError(
          400,
          "Request validation failed",
          "VALIDATION_ERROR",
          result.errors
        );
      }

      /*
       * Replace request values with sanitized/
       * normalized values returned by validator.
       */
      if (result.value?.body) {
        req.body = result.value.body;
      }

      if (result.value?.params) {
        req.params = result.value.params;
      }

      if (result.value?.query) {
        req.query = result.value.query;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

const validateRequired = (fields = []) => {
  return (req, res, next) => {
    try {
      const errors = [];

      for (const field of fields) {
        const value = req.body?.[field];

        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" &&
            value.trim() === "")
        ) {
          errors.push({
            field,
            message: `${field} is required`,
          });
        }
      }

      if (errors.length > 0) {
        throw new ApiError(
          400,
          "Request validation failed",
          "VALIDATION_ERROR",
          errors
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


const mongoose = require("mongoose");

const validateObjectId = (parameterName = "id") => {
  return (req, res, next) => {
    try {
      const value = req.params?.[parameterName];

      if (
        !value ||
        !mongoose.Types.ObjectId.isValid(value)
      ) {
        throw new ApiError(
          400,
          `Invalid ${parameterName}`,
          "INVALID_OBJECT_ID"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  validate,
  validateRequired,
  validateObjectId,
};