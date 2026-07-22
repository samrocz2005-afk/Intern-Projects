import React from "react";
import { Layout, Typography, Space, Tag, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";

const { Header } = Layout;
const { Title, Text } = Typography;

const HeaderBar = () => {
  const { user, logout } = useAuth();

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Library Management System
      </Title>

      <Space size="middle">
        <div style={{ textAlign: "right" }}>
          <Text strong>{user?.username}</Text>
          <br />
        </div>

        <Button
          danger
          icon={<LogoutOutlined />}
          onClick={logout}
        >
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default HeaderBar;