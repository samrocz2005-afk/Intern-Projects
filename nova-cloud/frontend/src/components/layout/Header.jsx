import React from "react";

import {
  Layout,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Button,
  message,
} from "antd";

import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import {
  useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const {
  Header: AntHeader,
} = Layout;

const {
  Text,
} = Typography;

const Header = () => {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const handleLogout =
    async () => {
      try {
        await logout();

        message.success(
          "Logged out successfully"
        );

        navigate("/login", {
          replace: true,
        });
      } catch (error) {
        navigate("/login", {
          replace: true,
        });
      }
    };

  const menuItems = [
    {
      key: "profile",
      icon: (
        <UserOutlined />
      ),
      label: "Profile",
    },

    {
      type: "divider",
    },

    {
      key: "logout",
      danger: true,
      icon: (
        <LogoutOutlined />
      ),
      label: "Logout",
    },
  ];

  const handleMenuClick =
    ({ key }) => {
      if (key === "logout") {
        handleLogout();
        return;
      }

      if (key === "profile") {
        console.log("CLICK PROFILE");
        navigate("/Profile");
        return;
      }
    };

  return (
    <AntHeader
      style={{
        padding: "0 24px",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        borderBottom:
          "1px solid #f0f0f0",
      }}
    >
      <Dropdown
        menu={{
          items: menuItems,
          onClick:
            handleMenuClick,
        }}
        trigger={["click"]}
      >
        <Button
          type="text"
          style={{
            height: 48,
          }}
        >
          <Space>
            <Avatar
              icon={
                <UserOutlined />
              }
            />

            <span>
              <Text strong>
                {user?.name ||
                  user?.email ||
                  "User"}
              </Text>
            </span>
          </Space>
        </Button>
      </Dropdown>
    </AntHeader>
  );
};

export default Header;