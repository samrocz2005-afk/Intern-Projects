import User from "../models/User.js";
import { ROLES } from "../utils/constants.js";

// ===============================
// Get All Users (Exclude Admin)
// ===============================
const getAllUsers = async () => {
  return await User.find({
    role: { $ne: ROLES.ADMIN },
  }).select("-password");
};

// ===============================
// Update User Role
// ===============================
const updateUserRole = async (userId, role) => {
  // Only MEMBER and READER are allowed
  const allowedRoles = [
    ROLES.MEMBER,
    ROLES.READER,
  ];

  if (!allowedRoles.includes(role)) {
    throw new Error(
      "Invalid role. Only MEMBER and READER are allowed."
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Prevent updating Admin account
  if (user.role === ROLES.ADMIN) {
    throw new Error("Admin role cannot be changed.");
  }

  user.role = role;

  await user.save();

  return await User.findById(userId).select("-password");
};

export default {
  getAllUsers,
  updateUserRole,
};