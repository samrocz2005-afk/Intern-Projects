const User = require("../models/User");
const jwt = require("jsonwebtoken");

/*
|--------------------------------------------------------------------------
| Generate JWT
|--------------------------------------------------------------------------
*/

const generateToken = (userId, role) => {
  return jwt.sign(
    {
      id: userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
};

/*
|--------------------------------------------------------------------------
| Ensure Admin User
|--------------------------------------------------------------------------
*/

const ensureAdminUser = async () => {
  const adminEmail =
    process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const adminPassword =
    process.env.ADMIN_PASSWORD;

  const adminName =
    process.env.ADMIN_NAME ||
    "NovaCloud Administrator";

  if (!adminEmail) {
    throw new Error(
      "ADMIN_EMAIL is missing from .env",
    );
  }

  if (!adminPassword) {
    throw new Error(
      "ADMIN_PASSWORD is missing from .env",
    );
  }

  let admin = await User.findOne({
    email: adminEmail,
  }).select("+password");

  /*
  |--------------------------------------------------------------------------
  | Create Admin
  |--------------------------------------------------------------------------
  */

  if (!admin) {
    admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      isActive: true,
      balance: 0,

      profileImage: {
        data: null,
        contentType: null,
      },
    });

    console.log(
      `Admin user created: ${adminEmail}`,
    );

    return admin;
  }

  /*
  |--------------------------------------------------------------------------
  | Ensure Admin Role
  |--------------------------------------------------------------------------
  */

  let changed = false;

  if (admin.role !== "admin") {
    admin.role = "admin";
    changed = true;
  }

  if (!admin.isActive) {
    admin.isActive = true;
    changed = true;
  }

  if (changed) {
    await admin.save();

    console.log(
      `Admin user updated: ${adminEmail}`,
    );
  }

  return admin;
};

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

const registerUser = async ({
  name,
  email,
  password,
}) => {
  if (!name || !email || !password) {
    const error = new Error(
      "Name, email and password are required",
    );

    error.statusCode = 400;

    throw error;
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const existingUser =
    await User.findOne({
      email: normalizedEmail,
    });

  if (existingUser) {
    const error = new Error(
      "User with this email already exists",
    );

    error.statusCode = 409;

    throw error;
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "user",
    isActive: true,

    profileImage: {
      data: null,
      contentType: null,
    },
  });

  const token = generateToken(
    user._id,
    user.role,
  );

  return {
    user,
    token,
  };
};

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

const loginUser = async ({
  email,
  password,
}) => {
  if (!email || !password) {
    const error = new Error(
      "Email and password are required",
    );

    error.statusCode = 400;

    throw error;
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const adminEmail =
    process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

  const adminPassword =
    process.env.ADMIN_PASSWORD;

  /*
  |--------------------------------------------------------------------------
  | Admin Login
  |--------------------------------------------------------------------------
  */

  if (
    adminEmail &&
    adminPassword &&
    normalizedEmail === adminEmail &&
    password === adminPassword
  ) {
    const admin =
      await ensureAdminUser();

    admin.lastLogin = new Date();

    await admin.save();

    const token = generateToken(
      admin._id,
      "admin",
    );

    return {
      user: admin,
      token,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Normal User Login
  |--------------------------------------------------------------------------
  */

  const user =
    await User.findOne({
      email: normalizedEmail,
    }).select("+password");

  if (!user) {
    const error = new Error(
      "Invalid email or password",
    );

    error.statusCode = 401;

    throw error;
  }

  if (!user.isActive) {
    const error = new Error(
      "Your account is inactive",
    );

    error.statusCode = 403;

    throw error;
  }

  const isPasswordValid =
    await user.comparePassword(
      password,
    );

  if (!isPasswordValid) {
    const error = new Error(
      "Invalid email or password",
    );

    error.statusCode = 401;

    throw error;
  }

  user.lastLogin = new Date();

  await user.save();

  const token = generateToken(
    user._id,
    user.role,
  );

  return {
    user,
    token,
  };
};

/*
|--------------------------------------------------------------------------
| Get Current User
|--------------------------------------------------------------------------
*/

const getCurrentUser = async (
  userId,
) => {
  const user =
    await User.findById(userId);

  if (!user) {
    const error = new Error(
      "User not found",
    );

    error.statusCode = 404;

    throw error;
  }

  return user;
};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

const changePassword = async (
  userId,
  {
    currentPassword,
    newPassword,
  },
) => {
  if (
    !currentPassword ||
    !newPassword
  ) {
    const error = new Error(
      "Current password and new password are required",
    );

    error.statusCode = 400;

    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error(
      "New password must be at least 6 characters",
    );

    error.statusCode = 400;

    throw error;
  }

  const user =
    await User.findById(
      userId,
    ).select("+password");

  if (!user) {
    const error = new Error(
      "User not found",
    );

    error.statusCode = 404;

    throw error;
  }

  const isValid =
    await user.comparePassword(
      currentPassword,
    );

  if (!isValid) {
    const error = new Error(
      "Current password is incorrect",
    );

    error.statusCode = 401;

    throw error;
  }

  user.password = newPassword;

  await user.save();

  return true;
};

/*
|--------------------------------------------------------------------------
| Update User Profile
|--------------------------------------------------------------------------
*/

const updateUserProfile = async (
  userId,
  profileData,
) => {
  const user =
    await User.findById(userId);

  if (!user) {
    const error = new Error(
      "User not found",
    );

    error.statusCode = 404;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Name
  |--------------------------------------------------------------------------
  */

  if (
    profileData.name !== undefined
  ) {
    const name =
      profileData.name.trim();

    if (name.length < 2) {
      const error = new Error(
        "Name must be at least 2 characters",
      );

      error.statusCode = 400;

      throw error;
    }

    user.name = name;
  }

  /*
  |--------------------------------------------------------------------------
  | Phone
  |--------------------------------------------------------------------------
  */

  if (
    profileData.phone !== undefined &&
    user.schema.path("phone")
  ) {
    user.phone =
      profileData.phone?.trim() ||
      "";
  }

  await user.save();

  return user;
};

/*
|--------------------------------------------------------------------------
| Update Profile Image - MongoDB Buffer
|--------------------------------------------------------------------------
|
| Approach 3:
|
| Frontend
|     ↓
| FormData
|     ↓
| Multer memoryStorage()
|     ↓
| req.file.buffer
|     ↓
| MongoDB User document
|
| No:
|   - uploads folder
|   - diskStorage
|   - GridFS
|   - GridFS ObjectId
|
|--------------------------------------------------------------------------
*/

const updateProfileImage = async (
  userId,
  file,
) => {
  /*
  |--------------------------------------------------------------------------
  | Validate User ID
  |--------------------------------------------------------------------------
  */

  if (!userId) {
    const error = new Error(
      "User ID is required",
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Validate File
  |--------------------------------------------------------------------------
  */

  if (!file) {
    const error = new Error(
      "Profile image file is required",
    );

    error.statusCode = 400;

    throw error;
  }

  if (!file.buffer) {
    const error = new Error(
      "Uploaded image buffer is missing",
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Validate Content Type
  |--------------------------------------------------------------------------
  */

  if (!file.mimetype) {
    const error = new Error(
      "Image content type is missing",
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Find User
  |--------------------------------------------------------------------------
  */

  const user =
    await User.findById(userId);

  if (!user) {
    const error = new Error(
      "User not found",
    );

    error.statusCode = 404;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Save Image Buffer Directly
  |--------------------------------------------------------------------------
  */

  user.profileImage = {
    data: file.buffer,

    contentType: file.mimetype,
  };

  /*
  |--------------------------------------------------------------------------
  | Save User
  |--------------------------------------------------------------------------
  */

  await user.save();

  /*
  |--------------------------------------------------------------------------
  | Fetch Updated User
  |--------------------------------------------------------------------------
  */

  const updatedUser =
    await User.findById(userId);

  if (!updatedUser) {
    const error = new Error(
      "Unable to retrieve updated user",
    );

    error.statusCode = 500;

    throw error;
  }

  console.log(
    "MongoDB Buffer profile image saved:",
    {
      userId: updatedUser._id.toString(),
      contentType:
        updatedUser.profileImage
          ?.contentType,
      size:
        updatedUser.profileImage
          ?.data?.length || 0,
    },
  );

  return updatedUser;
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  changePassword,
  updateUserProfile,
  updateProfileImage,
  ensureAdminUser,
  generateToken,
};