import jwt from "jsonwebtoken";

/**
 * Verify JWT Token
 */
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token is required.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalize req.user.role to always be an array
    if (decoded && decoded.role) {
      decoded.role = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

/**
 * Admin Only
 */
export const requireAdmin = (req, res, next) => {
  const userRoles = Array.isArray(req.user?.role) ? req.user.role : [req.user?.role];

  if (!req.user || !userRoles.includes("Admin")) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};

/**
 * Member or Admin or Specific Permissions
 */
export const requireMemberOrAdmin = (req, res, next) => {
  const userRoles = Array.isArray(req.user?.role) ? req.user.role : [req.user?.role];
  const allowedRoles = ["Admin", "Member"];

  const hasAccess = userRoles.some((role) => allowedRoles.includes(role));

  if (!req.user || !hasAccess) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Member or Admin privileges required.",
    });
  }

  next();
};

export default verifyToken;