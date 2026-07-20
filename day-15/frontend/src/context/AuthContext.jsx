import React, {
  createContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  logoutUser,
} from "../api/authApi";

import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from "../utils/constants";


const AuthContext = createContext();



export const AuthProvider = ({
  children,
}) => {


  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);




  // Restore session after refresh
  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");


    const accessToken =
      localStorage.getItem(
        ACCESS_TOKEN_KEY
      );



    if (
      storedUser &&
      accessToken
    ) {

      setUser(
        JSON.parse(storedUser)
      );

    }


    setLoading(false);


  }, []);






  const register = async (
    userData
  ) => {


    setLoading(true);


    try {

      return await registerUser(
        userData
      );


    } finally {

      setLoading(false);

    }

  };







  const login = async (
    credentials
  ) => {


    setLoading(true);


    try {


      console.log(
        "Credentials:",
        credentials
      );



      const response =
        await loginUser(
          credentials
        );



      console.log(
        "Login Response:",
        response
      );



      const {
        accessToken,
        refreshToken,
        user,
      } = response.data;



      localStorage.setItem(
        ACCESS_TOKEN_KEY,
        accessToken
      );


      localStorage.setItem(
        REFRESH_TOKEN_KEY,
        refreshToken
      );


      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );



      setUser(user);



      return response;



    } finally {

      setLoading(false);

    }

  };







  const logout = async () => {


    try {


      const refreshToken =
        localStorage.getItem(
          REFRESH_TOKEN_KEY
        );



      if (refreshToken) {

        await logoutUser(
          refreshToken
        );

      }



    } catch(error) {


      console.error(
        "Logout Error:",
        error
      );


    } finally {


      localStorage.removeItem(
        ACCESS_TOKEN_KEY
      );


      localStorage.removeItem(
        REFRESH_TOKEN_KEY
      );


      localStorage.removeItem(
        "user"
      );



      setUser(null);



      window.location.href =
        "/login";

    }

  };







  return (

    <AuthContext.Provider

      value={{

        user,

        loading,

        login,

        logout,

        register,

        isAuthenticated:
          !!user,

      }}

    >

      {children}

    </AuthContext.Provider>

  );

};



export default AuthContext;