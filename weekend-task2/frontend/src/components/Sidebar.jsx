import React from "react";
import { Layout, Menu } from "antd";
import { DashboardOutlined, HomeOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const { Sider } = Layout;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth || {});

  // Safely normalize user role(s) to support strings or arrays
  const userRolesArray = Array.isArray(user?.role)
    ? user.role.map((r) => (typeof r === "string" ? r.toLowerCase() : ""))
    : [typeof user?.role === "string" ? user.role.toLowerCase() : "reader"];

  // Check permissions for Movies/Dashboard and Cinemas
  const canViewMovies = userRolesArray.some((r) =>
    ["admin", "member", "movie read", "movie create", "movie update", "movie delete"].includes(r)
  );

  const canViewCinemas = userRolesArray.some((r) =>
    ["admin", "member", "cinema read", "cinema create", "cinema update", "cinema delete"].includes(r)
  );

  const isAdmin = userRolesArray.includes("admin");

  const mainItems = [
    ...(canViewMovies
      ? [
          {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
        ]
      : []),
    ...(canViewCinemas
      ? [
          {
            key: "/cinemas",
            icon: <HomeOutlined />,
            label: "Cinemas",
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            key: "/users",
            icon: <TeamOutlined />,
            label: "Manage Users",
          },
        ]
      : []),
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  // Dynamically resolve the correct active menu highlight based on route patterns
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/cinemas")) return "/cinemas";
    if (path.includes("/users")) return "/users";
    return "/dashboard";
  };

  return (
    <Sider
      width={220}
      breakpoint="lg"
      collapsedWidth="80"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          height: 64,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        Movie Explorer
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={mainItems}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}

export default Sidebar;