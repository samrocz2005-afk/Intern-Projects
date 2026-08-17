import React from "react";
import { Layout } from "antd";

import Header from "./Header";
import Sidebar from "./Sidebar";

const { Content } = Layout;

function AppLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout>
        <Header />

        <Content
          style={{
            margin: "24px",
            padding: "24px",
            background: "#ffffff",
            minHeight: "calc(100vh - 112px)",
            borderRadius: "8px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AppLayout;