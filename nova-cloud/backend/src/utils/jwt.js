const jwt = require("jsonwebtoken");

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not configured"
    );
  }

  return process.env.JWT_SECRET;
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    getJwtSecret()
  );
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateAccessToken,
  verifyToken,
  decodeToken,
};