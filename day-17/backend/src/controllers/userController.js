import userService from "../services/userService.js";

import {
  successResponse,
} from "../utils/response.js";

import {
  ROLES,
} from "../utils/constants.js";



// ===============================
// Get All Users (Admin)
// ===============================
export const getAllUsers = async (
  req,
  res,
  next
) => {

  try {

    const users =
      await userService.getAllUsers();


    return successResponse(
      res,
      "Users fetched successfully",
      users
    );


  } catch (error) {

    next(error);

  }

};




// ===============================
// Update User Role (Admin)
// ===============================
export const updateUserRole = async (
  req,
  res,
  next
) => {

  try {

    const {
      role,
    } = req.body;



    // Validate role

    if (
      !Object.values(ROLES)
        .includes(role)
    ) {

      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });

    }



    const user =
      await userService.updateUserRole(
        req.params.id,
        role
      );



    return successResponse(
      res,
      "User role updated successfully",
      user
    );



  } catch (error) {

    next(error);

  }

};