const User = require("../models/User");

// Get user by ID
const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Get user by email
const getUserByEmail = async (email) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  });

  return user;
};

// Update user profile
const updateProfile = async (userId, data) => {
  const allowedFields = ["name"];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

// Change password
const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isPasswordValid =
    await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  user.password = newPassword;

  await user.save();

  return {
    message: "Password changed successfully",
  };
};

// Update account balance
const updateBalance = async (userId, amount) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: {
        balance: amount,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  getUserById,
  getUserByEmail,
  updateProfile,
  changePassword,
  updateBalance,
};