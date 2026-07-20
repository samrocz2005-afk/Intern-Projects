import User from "../models/User.js";

const getAllUsers = async () => {
  return await User.find().select("-password -refreshToken");
};

const updateUserRole = async (userId, role) => {
  const allowedRoles = ["Admin", "Member", "Reader"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -refreshToken");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export default {
  getAllUsers,
  updateUserRole,
};