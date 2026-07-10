import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ProfileOutlined,
  CheckSquareOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useUIStore from "../../store/uiStore";

const { Sider } = Layout;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // FIX: Changed logoutUser to logout to match your Zustand store actions
  const { user, logout } = useAuth();

  const {
    sidebarCollapsed,
    toggleSidebar,
  } = useUIStore();

  const handleMenuClick = ({ key }) => {
    if (key === "/logout") {
      logout(); // FIX: Called logout() instead of logoutUser()
      navigate("/login", { replace: true });
      return;
    }

    navigate(key);
  };

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
    >
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          padding: "20px",
          fontSize: 18,
          fontWeight: "bold",
        }}
      >
        {sidebarCollapsed ? "TM" : "Task Manager"}
      </div>

      {!sidebarCollapsed && (
        <div
          style={{
            color: "#fff",
            textAlign: "center",
            marginBottom: 20,
            padding: "0 12px",
          }}
        >
          <div>Welcome</div>
          <strong>{user?.name}</strong>
        </div>
      )}

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={handleMenuClick}
        items={[
          {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
          {
            key: "/dashboard/tasks",
            icon: <CheckSquareOutlined />,
            label: "My Tasks",
          },
          {
            key: "/dashboard/profile",
            icon: <ProfileOutlined />,
            label: "My Profile",
          },
          {
            type: "divider",
          },
          {
            key: "/logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            danger: true,
          },
        ]}
      />
    </Sider>
  );
}

export default Sidebar;