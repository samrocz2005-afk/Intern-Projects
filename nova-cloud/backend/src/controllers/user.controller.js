const userService = require("../services/user.service");

const {
  successResponse,
  createdResponse,
} = require("../utils/apiResponse");

// GET /api/users/me
const getProfile = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await userService.getUserById(
        req.user._id
      );

    return successResponse(
      res,
      user,
      "Profile retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/me
const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await userService.updateProfile(
        req.user._id,
        req.body
      );

    return successResponse(
      res,
      user,
      "Profile updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/users
// Admin only
const getUsers = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await userService.getUsers(
        req.query
      );

    return successResponse(
      res,
      result,
      "Users retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/users/:id
// Admin only
const getUser = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await userService.getUserById(
        req.params.id
      );

    return successResponse(
      res,
      user,
      "User retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id
// Admin only
const updateUser = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await userService.updateUser(
        req.params.id,
        req.body
      );

    return successResponse(
      res,
      user,
      "User updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// PATCH /api/users/:id/status
// Admin only
const updateUserStatus = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await userService.updateUserStatus(
        req.params.id,
        req.body.isActive
      );

    return successResponse(
      res,
      user,
      "User status updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id
// Admin only
const deleteUser = async (
  req,
  res,
  next
) => {
  try {
    await userService.deleteUser(
      req.params.id
    );

    return successResponse(
      res,
      null,
      "User deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getUsers,
  getUser,
  updateUser,
  updateUserStatus,
  deleteUser,
};