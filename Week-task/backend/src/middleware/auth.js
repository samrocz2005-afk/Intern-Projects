const jwt = require("jsonwebtoken");

const ApiError = require("../utils/ApiError");
const User = require("../models/User");
const Customer = require("../models/Customer");

/*
 * --------------------------------------------------
 * Verify JWT
 * --------------------------------------------------
 */

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    /*
     * Authorization header must be:
     *
     * Authorization: Bearer <token>
     */
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new ApiError(
        401,
        "Authentication token is required",
        "AUTH_TOKEN_REQUIRED"
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new ApiError(
        401,
        "Authentication token is required",
        "AUTH_TOKEN_REQUIRED"
      );
    }

    /*
     * --------------------------------------------------
     * Verify JWT
     * --------------------------------------------------
     */

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new ApiError(
          401,
          "Authentication token has expired",
          "TOKEN_EXPIRED"
        );
      }

      if (error.name === "JsonWebTokenError") {
        throw new ApiError(
          401,
          "Invalid authentication token",
          "INVALID_TOKEN"
        );
      }

      throw new ApiError(
        401,
        "Authentication failed",
        "AUTHENTICATION_FAILED"
      );
    }

    /*
     * JWT must contain user ID or email.
     */
    if (!decoded?.id && !decoded?.email) {
      throw new ApiError(
        401,
        "Invalid authentication token",
        "INVALID_TOKEN"
      );
    }

    /*
     * --------------------------------------------------
     * Check if Env Admin
     * --------------------------------------------------
     */
    if (
      decoded.id === "env-admin-id" ||
      (process.env.ADMIN_EMAIL && decoded.email === process.env.ADMIN_EMAIL)
    ) {
      req.user = {
        id: "env-admin-id",
        name: process.env.ADMIN_NAME || "Admin",
        email: process.env.ADMIN_EMAIL,
        role: "admin",
        isActive: true,
      };

      return next();
    }

    /*
     * --------------------------------------------------
     * Fetch User or Customer
     * --------------------------------------------------
     */

    let user = await User.findById(decoded.id)
      .select("_id name email role isActive")
      .lean();

    let customer = null;

    if (!user) {
      customer = await Customer.findById(decoded.id).lean();

      if (customer) {
        user = {
          _id: customer._id,
          name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || customer.email,
          email: customer.email,
          role: "customer",
          isActive: customer.status === "Active",
        };
      }
    }

    if (!user) {
      throw new ApiError(
        401,
        "User account not found",
        "USER_NOT_FOUND"
      );
    }

    /*
     * --------------------------------------------------
     * Account Status
     * --------------------------------------------------
     */

    if (user.isActive === false) {
      throw new ApiError(
        403,
        "Your account is inactive",
        "ACCOUNT_INACTIVE"
      );
    }

    /*
     * --------------------------------------------------
     * Attach authenticated user
     * --------------------------------------------------
     */

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "customer",
      isActive: user.isActive ?? true,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/*
 * --------------------------------------------------
 * Role-Based Authorization
 * --------------------------------------------------
 */

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          "Authentication required",
          "AUTHENTICATION_REQUIRED"
        );
      }

      const userRoleLower = req.user.role ? req.user.role.toLowerCase() : "";
      const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());

      if (!allowedRolesLower.includes(userRoleLower)) {
        throw new ApiError(
          403,
          "You do not have permission to perform this action",
          "INSUFFICIENT_ROLE"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/*
 * --------------------------------------------------
 * Permission-Based Authorization
 * --------------------------------------------------
 */

const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          401,
          "Authentication required",
          "AUTHENTICATION_REQUIRED"
        );
      }

      if (req.user.role.toLowerCase() === "admin") {
        return next();
      }

      const userPermissions = [];

      const hasPermission =
        requiredPermissions.every((permission) =>
          userPermissions.includes(permission)
        );

      if (!hasPermission) {
        throw new ApiError(
          403,
          "You do not have permission to perform this action",
          "INSUFFICIENT_PERMISSION"
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  verifyToken,
  requireRole,
  requirePermission,
};