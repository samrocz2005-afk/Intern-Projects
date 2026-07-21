import api from "./axios";


// ==========================
// Register
// ==========================
export const registerUser = async (userData) => {

  const response =
    await api.post(
      "/auth/register",
      userData
    );

  return response.data;

};




// ==========================
// Login
// ==========================
export const loginUser = async (
  credentials
) => {


  console.log(
    "Login Credentials:",
    credentials
  );



  const response =
    await api.post(
      "/auth/login",
      {
        email: credentials.email,
        password: credentials.password,
      }
    );



  console.log(
    "Login API Response:",
    response.data
  );



  return response.data;

};




// ==========================
// Refresh Token
// ==========================
export const refreshAccessToken = async (
  refreshToken
) => {


  const response =
    await api.post(
      "/auth/refresh",
      {
        refreshToken,
      }
    );


  return response.data;

};




// ==========================
// Logout
// ==========================
export const logoutUser = async (
  refreshToken
) => {


  const response =
    await api.post(
      "/auth/logout",
      {
        refreshToken,
      }
    );


  return response.data;

};