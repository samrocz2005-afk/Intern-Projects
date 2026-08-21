const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const {
  protect,
} = require("../middleware/auth.middleware");

const {
  authorize,
} = require("../middleware/role.middleware");

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

// GET /api/users/me
router.get(
  "/me",
  protect,
  userController.getProfile
);

// PUT /api/users/me
router.put(
  "/me",
  protect,
  userController.updateProfile
);

/*
|--------------------------------------------------------------------------
| Admin User Management
|--------------------------------------------------------------------------
*/

// GET /api/users
router.get(
  "/",
  protect,
  authorize("admin"),
  userController.getUsers
);

// GET /api/users/:id
router.get(
  "/:id",
  protect,
  authorize("admin"),
  userController.getUser
);

// PUT /api/users/:id
router.put(
  "/:id",
  protect,
  authorize("admin"),
  userController.updateUser
);

// PATCH /api/users/:id/status
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  userController.updateUserStatus
);

// DELETE /api/users/:id
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  userController.deleteUser
);

module.exports = router;