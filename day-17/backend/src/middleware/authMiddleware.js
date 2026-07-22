import jwt from "jsonwebtoken";

import { jwtConfig } from "../config/jwt.js";
import { errorResponse } from "../utils/response.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return errorResponse(res, "Authorization header is required", 401);
    }

    if (!authHeader.startsWith("Bearer ")) {
      return errorResponse(
        res,
        "Invalid authorization format. Use: Bearer <token>",
        401,
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return errorResponse(res, "Access token is required", 401);
    }

    const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);

    console.log("Decoded JWT:", decoded);

    req.user = {
      id: decoded.id,

      username: decoded.username,

      role: decoded.role?.toUpperCase(),
    };

    console.log("Authenticated User:", req.user);

    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return errorResponse(res, "Access token has expired", 401);
    }

    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, "Invalid access token", 401);
    }

    return errorResponse(res, "Unauthorized", 401);
  }
};

export default authMiddleware;
