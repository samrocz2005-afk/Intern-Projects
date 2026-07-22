import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Typography } from "antd";
import {
  BookOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { useAuth } from "../hooks/useAuth";
import { getBooks } from "../api/bookApi";
import { getUsers } from "../api/userApi";
import { ROLES } from "../utils/constants";

const { Title, Text } = Typography;


const Dashboard = () => {
  const { user } = useAuth();

  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);



  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);



  const loadDashboard = async () => {
    try {

      // Books API
      const booksResponse = await getBooks();

      console.log(
        "Books Response:",
        booksResponse
      );


      setBookCount(
        booksResponse?.data?.total ??
        booksResponse?.data?.books?.length ??
        booksResponse?.total ??
        booksResponse?.books?.length ??
        0
      );



      // Users API (Admin only)
      if (
        user?.role?.toUpperCase() === ROLES.ADMIN
      ) {

        const usersResponse = await getUsers();


        console.log(
          "Users Response:",
          usersResponse
        );


        const users =
          usersResponse?.data?.users ??
          usersResponse?.users ??
          usersResponse?.data ??
          [];


        setUserCount(
          usersResponse?.data?.total ??
          usersResponse?.total ??
          users.length ??
          0
        );

      }


    } catch (error) {

      console.error(
        "Dashboard API Error:",
        error.response?.data || error.message
      );

    }
  };



  return (
    <>
      <Title level={2}>
        Dashboard
      </Title>


      <Card
        style={{
          marginBottom: 24,
        }}
      >

        <Title level={4}>
          Welcome, {user?.username}
        </Title>


        <Text>
          Role:
          <strong>
            {" "}
            {user?.role}
          </strong>
        </Text>

      </Card>



      <Row gutter={[16, 16]}>



        {/* Books */}
        <Col xs={24} md={12} lg={8}>

          <Card>

            <Statistic
              title="Books"
              value={bookCount}
              prefix={<BookOutlined />}
            />

          </Card>

        </Col>




        {/* Users */}
        {user?.role?.toUpperCase() === ROLES.ADMIN && (

          <Col xs={24} md={12} lg={8}>

            <Card>

              <Statistic
                title="Users"
                value={userCount}
                prefix={<TeamOutlined />}
              />

            </Card>

          </Col>

        )}





        {/* Role */}
        <Col xs={24} md={12} lg={8}>

          <Card>

            <Statistic
              title="Current Role"
              value={user?.role || "READER"}
              prefix={<UserOutlined />}
            />

          </Card>

        </Col>


      </Row>

    </>
  );
};


export default Dashboard;