const jwt = require("jsonwebtoken");
const User = require("../models/User");

const MESSAGES = require("../constants/messages");

const protect = async (req, res, next) => {
  try {
    let token;

    /*
    |--------------------------------------------------------------------------
    | Get Bearer Token
    |--------------------------------------------------------------------------
    */

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      const error = new Error(MESSAGES.AUTH.AUTHENTICATION_REQUIRED);

      error.statusCode = 401;

      return next(error);
    }

    /*
    |--------------------------------------------------------------------------
    | Verify JWT
    |--------------------------------------------------------------------------
    */

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /*
    |--------------------------------------------------------------------------
    | Hardcoded Admin
    |--------------------------------------------------------------------------
    */

    if (decoded.id === "env-admin") {
      req.user = {
        _id: "env-admin",
        id: "env-admin",

        name: process.env.ADMIN_NAME || "NovaCloud Administrator",

        email: process.env.ADMIN_EMAIL || "admin@novacloud.com",

        role: process.env.ADMIN_ROLE || "admin",

        isActive: true,

        isEnvAdmin: true,
      };

      return next();
    }

    /*
    |--------------------------------------------------------------------------
    | Normal Database User
    |--------------------------------------------------------------------------
    */

    const user = await User.findById(decoded.id);

    if (!user) {
      const error = new Error(MESSAGES.AUTH.USER_NOT_FOUND);

      error.statusCode = 401;

      return next(error);
    }

    if (!user.isActive) {
      const error = new Error(MESSAGES.AUTH.ACCOUNT_INACTIVE);

      error.statusCode = 403;

      return next(error);
    }

    /*
    |--------------------------------------------------------------------------
    | Attach Authenticated User
    |--------------------------------------------------------------------------
    */

    req.user = user;

    next();
  } catch (error) {
    /*
    |--------------------------------------------------------------------------
    | JWT Errors
    |--------------------------------------------------------------------------
    */

    if (error.name === "TokenExpiredError") {
      error.statusCode = 401;
      error.message = MESSAGES.AUTH.TOKEN_EXPIRED;

      return next(error);
    }

    if (error.name === "JsonWebTokenError") {
      error.statusCode = 401;
      error.message = MESSAGES.AUTH.INVALID_TOKEN;

      return next(error);
    }

    next(error);
  }
};

module.exports = {
  protect,
};
