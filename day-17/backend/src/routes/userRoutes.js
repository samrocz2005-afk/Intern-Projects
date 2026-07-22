// routes/userRoutes.js

import express from "express";

import {
  getAllUsers,
  updateUserRole,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";


const router = express.Router();


// ===============================
// Get All Users (Admin Only)
// ===============================
router.get(
  "/",
  authMiddleware,
  roleMiddleware("ADMIN"),
  getAllUsers
);



// ===============================
// Update User Role (Admin Only)
// ===============================
router.put(
  "/:id/role",
  authMiddleware,
  roleMiddleware("ADMIN"),
  updateUserRole
);


export default router;