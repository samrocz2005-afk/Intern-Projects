const express = require("express");

const {
  register,
  login,
  getMe,
  changePassword,
  updateProfile,
  uploadProfileImage,
  getProfileImage,
  logout,
} = require("../controllers/auth.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  authRateLimiter,
} = require("../middleware/rateLimit.middleware");

const {
  uploadProfileImage: profileImageUpload,
} = require("../middleware/upload.middleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  authRateLimiter,
  register
);

router.post(
  "/login",
  authRateLimiter,
  login
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/me",
  protect,
  getMe
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.put(
  "/profile-image",
  protect,
  profileImageUpload.single("profileImage"),
  uploadProfileImage
);

/*
|--------------------------------------------------------------------------
| Get Profile Image
|--------------------------------------------------------------------------
*/

router.get(
  "/profile-image",
  protect,
  getProfileImage
);

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

router.put(
  "/change-password",
  protect,
  changePassword
);

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

router.post(
  "/logout",
  protect,
  logout
);

module.exports = router;