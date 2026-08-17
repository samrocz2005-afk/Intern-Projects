import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import api from "../services/axios";

const { Title, Text } = Typography;

function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    productCount: 0,
    lowStockCount: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch analytics and orders in parallel
        const [analyticsRes, ordersRes] = await Promise.all([
          api.get("/analytics").catch(() => null),
          api.get("/orders", { params: { page: 1, limit: 5 } }).catch(() => null),
        ]);

        const analyticsData = analyticsRes?.data?.data || analyticsRes?.data || {};

        // Extract orders array safely from various response formats
        const ordersData = ordersRes?.data?.data?.orders || ordersRes?.data?.orders || ordersRes?.data?.data || ordersRes?.data || [];
        
        const formattedOrders = Array.isArray(ordersData) ? ordersData.map((item, index) => {
          const cust = item.customer;
          const customerName = cust
            ? `${cust.firstName || ""} ${cust.lastName || ""}`.trim() || cust.email
            : "N/A";

          return {
            key: item._id || item.orderNumber || String(index + 1),
            orderId: item.orderNumber || item._id || "N/A",
            customerName: customerName,
            totalAmount: item.total ?? item.amount ?? 0,
            status: item.status || "Pending",
          };
        }) : [];

        setAnalytics({
          totalSales: analyticsData.totalSales || 0,
          totalRevenue: analyticsData.totalRevenue || 0,
          totalOrders: analyticsData.totalOrders || formattedOrders.length,
          totalCustomers: analyticsData.totalCustomers || 0,
          productCount: analyticsData.productCount || 0,
          lowStockCount: analyticsData.lowStockCount || 0,
          recentOrders: analyticsData.recentOrders?.length ? analyticsData.recentOrders : formattedOrders,
        });

      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        message.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const recentOrderColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "geekblue";
        if (status === "Completed" || status === "Delivered") color = "green";
        if (status === "Pending") color = "gold";
        if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ marginBottom: "4px" }}>
          Dashboard
        </Title>
        <Text type="secondary">
          Welcome to the Shopping Application
        </Text>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Products"
                  value={analytics.productCount}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Orders"
                  value={analytics.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Customers"
                  value={analytics.totalCustomers}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={analytics.totalRevenue}
                  precision={2}
                  prefix={<DollarOutlined />}
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />
              </Card>
            </Col>
          </Row>

          <Row
            gutter={[16, 16]}
            style={{ marginTop: "16px" }}
          >
            <Col xs={24} lg={16}>
              <Card title="Recent Orders">
                <Table
                  dataSource={analytics.recentOrders}
                  columns={recentOrderColumns}
                  rowKey={(record) => record.key || record._id || record.orderId}
                  pagination={false}
                  size="small"
                  scroll={{ x: "max-content" }}
                />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card title="Quick Overview">
                <p>
                  <strong>Products:</strong>{" "}
                  {analytics.productCount}
                </p>

                <p>
                  <strong>Orders:</strong>{" "}
                  {analytics.totalOrders}
                </p>

                <p>
                  <strong>Customers:</strong>{" "}
                  {analytics.totalCustomers}
                </p>

                <p>
                  <strong>Revenue:</strong>{" "}
                  ₹
                  {Number(
                    analytics.totalRevenue
                  ).toLocaleString("en-IN")}
                </p>

                <p>
                  <strong>Low Stock:</strong>{" "}
                  {analytics.lowStockCount}
                </p>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default Dashboard;