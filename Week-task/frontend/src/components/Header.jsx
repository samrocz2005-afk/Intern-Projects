import React from "react";
import { Layout, Typography, Avatar, Space, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

function Header() {
  const navigate = useNavigate();

  // Retrieve user info from localStorage (adjust based on how you store it)
  const userStr = localStorage.getItem("user");
  let userName = "Admin";
  
  try {
    if (userStr) {
      const user = JSON.parse(userStr);
      userName = user.name || user.firstName || "Admin";
    }
  } catch (e) {
    userName = "Admin";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const items = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        background: "#ffffff",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Shopping App
      </Title>

      <Space>
        <Dropdown menu={{ items }} trigger={["click"]}>
          <Space style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} />
            <Text strong>{userName}</Text>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}

export default Header;