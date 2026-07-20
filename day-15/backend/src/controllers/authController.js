import authService from "../services/authService.js";
import {
  successResponse,
  errorResponse,
} from "../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);

    return successResponse(
      res,
      "User registered successfully",
      user,
      201
    );
  } catch (error) {
    next(error);
  }
};


export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    return successResponse(
      res,
      "Login successful",
      result,
      200
    );
  } catch (error) {
    next(error);
  }
};


export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(
        res,
        "Refresh token is required",
        400
      );
    }

    const accessToken =
      await authService.refreshAccessToken(refreshToken);

    return successResponse(
      res,
      "Access token refreshed successfully",
      {
        accessToken,
      },
      200
    );

  } catch (error) {
    next(error);
  }
};


export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(
        res,
        "Refresh token is required",
        400
      );
    }

    const result =
      await authService.logout(refreshToken);

    return successResponse(
      res,
      result.message,
      null,
      200
    );

  } catch (error) {
    next(error);
  }
};