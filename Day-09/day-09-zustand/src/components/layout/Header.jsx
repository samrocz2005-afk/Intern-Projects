import React from "react";
import {
  Layout,
  Typography,
  Space,
  Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

import useAuth from "../../hooks/useAuth";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

function Header() {
  const { user } = useAuth();

  return (
    <AntHeader
      style={{
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      <Title
        level={3}
        style={{ margin: 0 }}
      >
        Student Task Management
      </Title>

      <Space size="middle">
        <div style={{ textAlign: "right" }}>
          <Text strong>{user?.name}</Text>

          <br />

          <Text type="secondary">
            {user?.department}
          </Text>
        </div>

        <Avatar
          size={40}
          icon={<UserOutlined />}
        />
      </Space>
    </AntHeader>
  );
}

export default Header;