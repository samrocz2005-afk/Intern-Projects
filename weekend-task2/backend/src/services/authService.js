import User from "../models/User.js";
import bcrypt from "bcryptjs";

/* ===========================
   AUTH
=========================== */

// Create User (Signup)
export const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    name,
    email,
    password: hashedPassword,
    // role defaults to "Reader" from schema
  });
};

// Find User by Email
export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Compare Password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/* ===========================
   ADMIN - USERS
=========================== */

// Get All Users
export const getUsers = async (query) => {
  const {
    search = "",
    page = 1,
    limit = 10,
  } = query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

// Create User (Admin)
export const createUserByAdmin = async ({
  name,
  email,
  password,
  role,
}) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "Reader",
  });
};

// Update User Role
export const updateUserRole = async (id, role) => {
  return await User.findByIdAndUpdate(
    id,
    { role },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");
};

// Delete User
export const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};