import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";

import { jwtConfig } from "../config/jwt.js";
import { ROLES } from "../utils/constants.js";

// ===============================
// Register
// ===============================
const register = async ({
  username,
  email,
  password,
}) => {
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,

    // Every registered user is a Reader
    role: ROLES.READER,
  });

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

// ===============================
// Login
// ===============================
const login = async ({
  email,
  password,
}) => {
  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid =
    await comparePassword(
      password,
      user.password
    );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const payload = {
    id: user._id,
    role: user.role,
  };

  const accessToken =
    generateAccessToken(payload);

  const refreshToken =
    generateRefreshToken(payload);

  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(
      Date.now() +
      7 * 24 * 60 * 60 * 1000
    ),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

// ===============================
// Refresh Access Token
// ===============================
const refreshAccessToken = async (
  token
) => {
  const decoded = jwt.verify(
    token,
    jwtConfig.refreshTokenSecret
  );

  const storedToken =
    await RefreshToken.findOne({
      token,
    });

  if (!storedToken) {
    throw new Error(
      "Invalid refresh token"
    );
  }

  if (
    storedToken.expiresAt <
    new Date()
  ) {
    await RefreshToken.deleteOne({
      _id: storedToken._id,
    });

    throw new Error(
      "Refresh token expired"
    );
  }

  return generateAccessToken({
    id: decoded.id,
    role: decoded.role,
  });
};

// ===============================
// Logout
// ===============================
const logout = async (token) => {
  await RefreshToken.deleteOne({
    token,
  });

  return {
    message: "Logged out successfully",
  };
};

export default {
  register,
  login,
  refreshAccessToken,
  logout,
};