import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowUpOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Analytics() {
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    customers: 0,
    revenueGrowth: 0,
  });

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/analytics"); // Adjust endpoint to match your backend route
      const result = response.data.data || response.data;

      // Extract metrics and trends from backend response
      const statistics = result.stats || result.statistics || {};
      const trends = result.trends || result.salesData || [];

      setStats({
        totalRevenue: statistics.totalRevenue || 0,
        totalOrders: statistics.totalOrders || 0,
        customers: statistics.customers || 0,
        revenueGrowth: statistics.revenueGrowth || 0,
      });

      const formattedSales = trends.map((item, index) => ({
        key: item._id || String(index + 1),
        month: item.month || item._id,
        orders: item.orders || 0,
        revenue: item.revenue || 0,
        growth: item.growth || 0,
      }));

      setSalesData(formattedSales);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to fetch analytics reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const columns = [
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      render: (revenue) => `₹${Number(revenue || 0).toLocaleString("en-IN")}`,
    },
    {
      title: "Growth",
      dataIndex: "growth",
      key: "growth",
      render: (growth) => (
        <Tag color="green">
          <ArrowUpOutlined /> {growth}%
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Operations & Sales" },
          { label: "Analytics & Reports" },
        ]}
      />
      <div style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ marginBottom: "4px" }}>
          Analytics & Reports
        </Title>

        <Text type="secondary">
          Track sales, revenue, orders, and business growth.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="₹"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Customers"
              value={stats.customers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Revenue Growth"
              value={stats.revenueGrowth}
              precision={1}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Sales Trends" style={{ marginTop: "16px" }}>
        <Table
          columns={columns}
          dataSource={salesData}
          loading={loading}
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}

export default Analytics;