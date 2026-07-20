// src/api/userApi.js

import api from "./axios";


// ===============================
// Get All Users (Admin)
// ===============================
export const getUsers = async () => {

  try {

    const response = await api.get("/users");

    return response.data;

  } catch (error) {

    throw error;

  }

};



// ===============================
// Update User Role (Admin)
// ===============================
export const updateUserRole = async (
  userId,
  role
) => {

  try {

    const response = await api.put(
      `/users/${userId}/role`,
      {
        role,
      }
    );


    return response.data;


  } catch (error) {

    throw error;

  }

};