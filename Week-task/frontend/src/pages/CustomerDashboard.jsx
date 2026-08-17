import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  Spin,
  message,
  Table,
  Tag,
} from "antd";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  HeartOutlined,
} from "@ant-design/icons";

import api from "../services/axios";

const { Title, Text } = Typography;

function CustomerDashboard() {
  const [analytics, setAnalytics] = useState({
    myOrders: 0,
    myTotalSpent: 0,
    wishlistCount: 0,
    availableProducts: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomerAnalytics = async () => {
      try {
        setLoading(true);

        const response = await api.get("/analytics/customer");
        console.log("Analytics API Response:", response.data);

        if (response.data?.success) {
          setAnalytics(response.data.data);
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch customer dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerAnalytics();
  }, []);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (orderNumber, record) =>
        orderNumber || `#${record._id ? record._id.slice(-6).toUpperCase() : "N/A"}`,
    },
    {
      title: "Total Amount",
      dataIndex: "total", 
      key: "total",
      render: (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "geekblue";
        if (status === "Delivered" || status === "Completed") color = "green";
        if (status === "Cancelled") color = "red";
        if (status === "Pending") color = "gold";
        return <Tag color={color}>{status || "Processing"}</Tag>;
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString("en-IN") : "N/A"),
    },
  ];

  return (
    <div>
      {/* Page Header */}
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ marginBottom: "4px" }}>
          My Dashboard
        </Title>
        <Text type="secondary">
          Welcome back! Here is a summary of your activity.
        </Text>
      </div>

      {/* Loading */}
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
          {/* Statistics */}
          <Row gutter={[16, 16]}>
            {/* My Orders */}
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="My Orders"
                  value={analytics.myOrders}
                  prefix={<ShoppingCartOutlined />}
                />
              </Card>
            </Col>

            {/* Total Spent */}
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Spent"
                  value={analytics.myTotalSpent}
                  precision={2}
                  prefix={<DollarOutlined />}
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />
              </Card>
            </Col>

            {/* Wishlist Items */}
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Wishlist Items"
                  value={analytics.wishlistCount}
                  prefix={<HeartOutlined />}
                />
              </Card>
            </Col>

            {/* Available Products */}
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Available Products"
                  value={analytics.availableProducts}
                  prefix={<ShoppingOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Bottom Section */}
          <Row
            gutter={[16, 16]}
            style={{ marginTop: "16px" }}
          >
            {/* Recent Orders */}
            <Col xs={24} lg={16}>
              <Card title="My Recent Orders">
                <Table
                    dataSource={analytics.recentOrders || analytics.orders || []}
                    columns={columns}
                    rowKey={(record) => record._id || record.orderNumber}
                    pagination={false}
                    size="small"
                    locale={{ emptyText: "No recent order history found." }}
                />
              </Card>
            </Col>

            {/* Quick Overview */}
            <Col xs={24} lg={8}>
              <Card title="Account Overview">
                <p>
                  <strong>Total Orders:</strong>{" "}
                  {analytics.myOrders}
                </p>

                <p>
                  <strong>Total Spent:</strong>{" "}
                  ₹
                  {Number(
                    analytics.myTotalSpent
                  ).toLocaleString("en-IN")}
                </p>

                <p>
                  <strong>Wishlist:</strong>{" "}
                  {analytics.wishlistCount} items
                </p>

                <p>
                  <strong>Store Products:</strong>{" "}
                  {analytics.availableProducts}
                </p>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default CustomerDashboard;