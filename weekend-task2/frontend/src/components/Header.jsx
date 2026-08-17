import React, { useCallback } from "react";
import { Layout, Typography, Space, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { LogoutButton } from "../utils/buttons";
import { RiAdminFill } from "react-icons/ri";
import { CiUser } from "react-icons/ci";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth || {});

  // Safely normalize user roles to handle strings or arrays properly
  const userRolesArray = Array.isArray(user?.role)
    ? user.role.map((r) => (typeof r === "string" ? r.toLowerCase() : ""))
    : [typeof user?.role === "string" ? user.role.toLowerCase() : "reader"];

  const isAdmin = userRolesArray.includes("admin");
  const isMember = userRolesArray.includes("member");

  // Display role string for UI mapping
  const displayRole = isAdmin ? "Admin" : isMember ? "Member" : (user?.role?.[0] || user?.role || "Reader");

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  const getRoleColor = (roleStr) => {
    switch (roleStr?.toLowerCase()) {
      case "admin":
        return "red";
      case "member":
        return "blue";
      case "reader":
        return "green";
      default:
        return "purple";
    }
  };

  return (
    <AntHeader
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#2596be",
        padding: "0 24px",
      }}
    >
      <Title level={3} style={{ color: "#fff", margin: 0 }}>
        Movie Explorer
      </Title>

      <Space size="middle" align="center">
        <Text style={{ color: "#fff", fontWeight: 500 }}>
          {user?.name || "Guest"}
        </Text>

        <Tag
          color={getRoleColor(displayRole)}
          icon={isAdmin ? <RiAdminFill /> : <CiUser />}
          style={{
            height: 32,
            lineHeight: "30px",
            padding: "0 12px",
            fontSize: 13,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            margin: 0,
            borderRadius: 6,
          }}
        >
          {typeof displayRole === "string" ? displayRole.toUpperCase() : "READER"}
        </Tag>

        <LogoutButton onClick={handleLogout} />
      </Space>
    </AntHeader>
  );
}

export default Header;