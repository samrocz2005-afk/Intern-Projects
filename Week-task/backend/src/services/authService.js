const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Customer = require("../models/Customer");
const ApiError = require("../utils/ApiError");

const SALT_ROUNDS = 12;

/*
 * --------------------------------
 * Generate JWT
 * --------------------------------
 */

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};

/*
 * --------------------------------
 * Remove sensitive fields
 * --------------------------------
 */

const sanitizeUser = (user) => {
  const userObject = user.toObject
    ? user.toObject()
    : { ...user };

  delete userObject.password;

  return userObject;
};

/*
 * --------------------------------
 * Signup
 * --------------------------------
 */

const signup = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  /*
   * Check if email already exists
   */
  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "Email already registered",
      "EMAIL_EXISTS"
    );
  }

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0];
  const lastName =
    nameParts.slice(1).join(" ") || firstName;

  const hashedPassword = await bcrypt.hash(
    password,
    SALT_ROUNDS
  );

  // 1. Create the Customer document FIRST so we get its exact _id
  let customer;
  try {
    customer = await Customer.create({
      firstName,
      lastName,
      email: normalizedEmail,
      status: "Active",
    });
  } catch (error) {
    throw error;
  }

  // 2. Create the User document, linking it to the Customer's _id
  let user;
  try {
    user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      customerRef: customer._id,
    });
  } catch (error) {
    // Rollback customer if user creation fails
    await Customer.findByIdAndDelete(customer._id);
    throw error;
  }

  // 3. Generate token using the CUSTOMER id so orders and notifications link properly!
  const tokenPayload = {
    id: customer._id,
    role: user.role || "Customer",
    email: user.email,
    name: user.name,
  };

  const token = jwt.sign(
    tokenPayload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  return {
    user: sanitizeUser(user),
    token,
  };
};

/*
 * --------------------------------
 * Login
 * --------------------------------
 */

const login = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  /*
   * Check if login matches .env admin credentials directly
   */
  if (
    process.env.ADMIN_EMAIL &&
    normalizedEmail === process.env.ADMIN_EMAIL.trim().toLowerCase() &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const adminUser = {
      _id: "env-admin-id",
      name: process.env.ADMIN_NAME || "Admin",
      email: normalizedEmail,
      role: "admin",
      isActive: true,
    };

    const token = generateToken(adminUser);

    return {
      user: sanitizeUser(adminUser),
      token,
    };
  }

  /*
   * Lookup normal users in MongoDB
   */
  const user = await User.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!user) {
    throw new ApiError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      403,
      "Your account is inactive",
      "ACCOUNT_INACTIVE"
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  // Find the corresponding Customer document using the email address
  let customer = await Customer.findOne({ email: normalizedEmail });

  // AUTO-PROVISION: If user exists in User model but missing in Customer model, create it now!
  if (!customer) {
    const nameParts = (user.name || "Customer User").trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "User";

    customer = await Customer.create({
      firstName,
      lastName,
      email: normalizedEmail,
      status: "Active",
    });
  }

  const targetId = customer._id;

  const token = jwt.sign(
    {
      id: targetId, // <-- Guaranteed to be the Customer collection _id
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  return {
    user: sanitizeUser(user),
    token,
  };
};

module.exports = {
  signup,
  login,
};