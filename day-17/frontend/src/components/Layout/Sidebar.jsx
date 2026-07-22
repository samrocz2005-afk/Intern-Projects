import React from "react";
import {
  DashboardOutlined,
  BookOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES, ROLES } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: ROUTES.BOOKS,
      icon: <BookOutlined />,
      label: "Books",
    },
  ];

  // Admin only
  if (user?.role === ROLES.ADMIN) {
    menuItems.push({
      key: ROUTES.USERS,
      icon: <TeamOutlined />,
      label: "Users",
    });
  }

  return (
    <Sider width={230}>
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          fontSize: 20,
          fontWeight: "bold",
          padding: "20px 0",
        }}
      >
        Library
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />

      <div
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          padding: "0 16px",
        }}
      >
        <Button
          danger
          block
          icon={<LogoutOutlined />}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;