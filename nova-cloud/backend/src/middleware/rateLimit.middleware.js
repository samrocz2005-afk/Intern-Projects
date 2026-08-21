const {
  rateLimit,
} = require("express-rate-limit");

const MESSAGES = require("../constants/messages");


 //Limits each IP address to 100 requests
 //within a 15-minute window.


const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 100,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      MESSAGES.API.RATE_LIMIT_EXCEEDED,
  },

  statusCode: 429,
});

 //Authentication endpoints are more sensitive,
 //so they receive a stricter limit.


const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 10,

  standardHeaders: "draft-8",

  legacyHeaders: false,

  message: {
    success: false,
    message:
      MESSAGES.API.RATE_LIMIT_EXCEEDED,
  },

  statusCode: 429,
});

module.exports = {
  apiRateLimiter,
  authRateLimiter,
};