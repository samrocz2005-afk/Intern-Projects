import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

const { Content } = Layout;

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout>
        <HeaderBar />

        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: "#fff",
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;