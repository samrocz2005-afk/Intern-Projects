import React, { useEffect, useState } from "react";
import { message } from "antd";

import UserTable from "../components/Users/UserTable";
import {
  getUsers,
  updateUserRole,
} from "../api/userApi";


const Users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);



  useEffect(() => {

    fetchUsers();

  }, []);




  const fetchUsers = async () => {

    try {

      setLoading(true);


      const response = await getUsers();


      console.log(
        "Users API Response:",
        response
      );



      const usersData = Array.isArray(
        response?.data
      )
        ? response.data
        : [];



      setUsers(usersData);



    } catch (error) {


      console.error(
        "Fetch Users Error:",
        error.response?.data || error.message
      );


      if (
        error.response?.status === 403
      ) {

        message.error(
          "You don't have permission to view users"
        );


      } else {

        message.error(
          error.response?.data?.message ||
          "Failed to load users"
        );

      }



    } finally {

      setLoading(false);

    }

  };





  const handleRoleChange = async (
    userId,
    role
  ) => {

    try {


      console.log(
        "Updating Role:",
        {
          userId,
          role,
        }
      );



      await updateUserRole(
        userId,
        role
      );



      message.success(
        "User role updated successfully"
      );



      fetchUsers();



    } catch (error) {


      console.error(
        "Update Role Error:",
        error.response?.data || error.message
      );


      message.error(
        error.response?.data?.message ||
        "Failed to update role"
      );


    }

  };





  return (

    <UserTable

      users={users}

      loading={loading}

      onRoleChange={handleRoleChange}

    />

  );

};


export default Users;