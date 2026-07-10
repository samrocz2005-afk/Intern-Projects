import React from "react";
import { Layout, Typography, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

import {
  selectCurrentUser,
} from "../../features/auth/authSelectors";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

function Header() {
  const user = useSelector(selectCurrentUser);

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
      <Title level={3} style={{ margin: 0 }}>
        Student Task Management
      </Title>

      <Space>
        <div style={{ textAlign: "right" }}>
          <Text strong>{user?.name}</Text>

          <br />
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