import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

const createToken = (payload, secret, expiresIn) => {
  if (!secret) {
    throw new Error("JWT secret is missing");
  }

  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const generateAccessToken = (payload) => {
  return createToken(
    payload,
    jwtConfig.accessTokenSecret,
    jwtConfig.accessTokenExpiresIn
  );
};

export const generateRefreshToken = (payload) => {
  return createToken(
    payload,
    jwtConfig.refreshTokenSecret,
    jwtConfig.refreshTokenExpiresIn
  );
};