import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ProfileOutlined,
  CheckSquareOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../features/auth/authSlice";
import {
  selectCurrentUser,
} from "../../features/auth/authSelectors";

import {
  toggleSidebar,
} from "../../features/ui/uiSlice";

import {
  selectSidebarCollapsed,
} from "../../features/ui/uiSelectors";

const { Sider } = Layout;

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectCurrentUser);
  const collapsed = useSelector(selectSidebarCollapsed);

  const handleMenuClick = ({ key }) => {
    if (key === "/logout") {
      dispatch(logout());
      navigate("/login");
      return;
    }

    navigate(key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={() => dispatch(toggleSidebar())}
    >
      <div
        style={{
          color: "#fff",
          textAlign: "center",
          padding: "20px",
          fontWeight: "bold",
        }}
      >
        {collapsed ? "TM" : "Task Manager"}
      </div>

      {!collapsed && (
        <div
          style={{
            color: "#fff",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Welcome
          <br />
          {user?.name}
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
            key: "/logout",
            icon: <LogoutOutlined />,
            label: "Logout",
          },
        ]}
      />
    </Sider>
  );
}

export default Sidebar;