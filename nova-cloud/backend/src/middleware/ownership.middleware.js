const mongoose = require("mongoose");

const ownership = (Model, options = {}) => {
  const {
    paramName = "id",
    ownerField = "owner",
    allowAdmin = true,
  } = options;

  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const resourceId = req.params[paramName];

      if (!resourceId) {
        return res.status(400).json({
          success: false,
          message: "Resource ID is required",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(resourceId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid resource ID",
        });
      }

      // Admin can access resources if configured
      if (
        allowAdmin &&
        req.user.role === "admin"
      ) {
        return next();
      }

      const resource = await Model.findById(
        resourceId
      ).select(ownerField);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      const ownerId =
        resource[ownerField]?.toString();

      const userId =
        req.user._id.toString();

      if (ownerId !== userId) {
        return res.status(403).json({
          success: false,
          message:
            "You do not have permission to access this resource",
        });
      }

      // Make resource available to controller
      req.resource = resource;

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  ownership,
};