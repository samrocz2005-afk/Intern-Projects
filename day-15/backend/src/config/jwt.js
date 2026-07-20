const requiredEnv = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const jwtConfig = {
  accessTokenSecret: requiredEnv("JWT_ACCESS_SECRET"),
  refreshTokenSecret: requiredEnv("JWT_REFRESH_SECRET"),

  accessTokenExpiresIn: "1h",
  refreshTokenExpiresIn: "7d",
};