const validate = (schema) => {
  return (req, res, next) => {
    const data = {
      body: req.body || {},
      params: req.params || {},
      query: req.query || {},
    };

    const { error, value } = schema.validate(
      data,
      {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
      }
    );

    if (error) {
      const errors = error.details.map(
        (detail) => ({
          field: detail.path.length
            ? detail.path.join(".")
            : "request",
          message: detail.message,
        })
      );

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Apply validated values
    |--------------------------------------------------------------------------
    */

    req.body = value.body || {};
    req.params = value.params || {};
    req.query = value.query || {};

    next();
  };
};

module.exports = {
  validate,
};