import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import GlobalBreadcrumb from "./GlobalBreadcrumb";

const { Content } = Layout;

const AppLayout = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      <Layout>
        {/* Header */}
        <Header />

        {/* Main Content */}
        <Content
          style={{
            padding: "16px 24px",
            minHeight: 0,
            overflow: "auto",
          }}
        >
          {/* Global Breadcrumb */}
          <GlobalBreadcrumb />

          {/* Current Route Page */}
          <div
            style={{
              marginTop: 16,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;