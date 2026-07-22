import { errorResponse } from "../utils/response.js";

const validate = (requiredFields = []) => {
  return (req, res, next) => {
    const errors = [];

    requiredFields.forEach((field) => {
      const value = req.body[field];

      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        errors.push({
          field,
          message: `${field} is required`,
        });
      }
    });

    if (errors.length > 0) {
      return errorResponse(
        res,
        "Validation failed",
        400,
        errors
      );
    }

    next();
  };
};

export default validate;