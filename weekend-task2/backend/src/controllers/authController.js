import { generateToken } from "../config/jwt.js";
import {
  createUser,
  findUserByEmail,
  comparePassword,
  getUsers,
  createUserByAdmin,
  updateUserRole,
  deleteUser,
} from "../services/authService.js";

/* ===========================
   SIGNUP
=========================== */

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Prevent signup using reserved admin email
    if (email === process.env.ADMIN_EMAIL) {
      return res.status(400).json({
        success: false,
        message: "This email is reserved.",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Default role = Reader (from User schema)
    const user = await createUser(name, email, password);

    res.status(201).json({
      success: true,
      message: "Signup successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   LOGIN
=========================== */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Protected Admin Login
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = generateToken({
        id: "admin",
        role: ["Admin"],
      });

      return res.status(200).json({
        success: true,
        message: "Admin login successful.",
        token,
        user: {
          id: "admin",
          name: "Administrator",
          email: process.env.ADMIN_EMAIL,
          role: ["Admin"],
        },
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   ADMIN - GET USERS
=========================== */

export const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers(req.query);

    res.status(200).json({
      success: true,
      ...users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   ADMIN - CREATE USER
=========================== */

export const createAdminUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (email === process.env.ADMIN_EMAIL) {
      return res.status(400).json({
        success: false,
        message: "This email is reserved.",
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Check if role includes 'Admin'
    const rolesArray = Array.isArray(role) ? role : [role];
    if (rolesArray.includes("Admin")) {
      return res.status(400).json({
        success: false,
        message: "Admin role cannot be assigned from UI.",
      });
    }

    const user = await createUserByAdmin({
      name,
      email,
      password,
      role: rolesArray,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   ADMIN - UPDATE ROLE
=========================== */

export const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Ensure role input is treated as an array for multi-role handling
    const rolesArray = Array.isArray(role) ? role : [role];

    if (rolesArray.includes("Admin")) {
      return res.status(400).json({
        success: false,
        message: "Admin role cannot be assigned.",
      });
    }

    // Prevent changing the protected admin account
    if (req.params.id === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin role cannot be changed.",
      });
    }

    // Call service to update user role array in the DB
    const user = await updateUserRole(req.params.id, rolesArray);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User roles updated successfully.",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   ADMIN - DELETE USER
=========================== */

export const removeUser = async (req, res) => {
  try {
    if (req.params.id === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin account cannot be deleted.",
      });
    }

    const user = await deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};