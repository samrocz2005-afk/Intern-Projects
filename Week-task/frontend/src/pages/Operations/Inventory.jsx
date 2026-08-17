import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  AlertOutlined,
  InboxOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import Breadcrumbs from "../../components/Breadcrumbs";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Inventory() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);

  const debouncedSearch = useDebounce(search, 500);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/inventory");
      console.log("API Response:", response.data);
      const result = response.data.data || [];

      const formattedInventory = result.map((item, index) => {
        const currentStock = item.stock ?? 0;
        const threshold = item.lowStockThreshold ?? 10;
        
        const categoryData = item.product?.category;
        const categoryName =
          typeof categoryData === "object" && categoryData !== null
            ? categoryData.name
            : typeof categoryData === "string"
            ? categoryData
            : "N/A";

        return {
          key: item._id || String(index + 1),
          product: item.product?.name || "N/A",
          category: categoryName,
          stock: currentStock,
          minimumStock: threshold,
          warehouse: item.warehouse || "Main Warehouse",
          status:
            currentStock === 0
              ? "Out of Stock"
              : currentStock <= threshold
              ? "Low Stock"
              : "In Stock",
        };
      });

      setInventory(formattedInventory);
    } catch (error) {
      console.error("Fetch Inventory Error Details:", error.response || error);
      message.error(
        error.response?.data?.message || "Failed to fetch inventory data"
      );
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInventoryData();
  }, []);

  const filteredInventory = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (!value) {
      return inventory;
    }

    return inventory.filter(
      (item) =>
        item.product.toLowerCase().includes(value) ||
        item.category.toLowerCase().includes(value) ||
        item.warehouse.toLowerCase().includes(value)
    );
  }, [inventory, debouncedSearch]);

  const totalProducts = inventory.length;

  const lowStockCount = inventory.filter(
    (item) => item.status === "Low Stock"
  ).length;

  const outOfStockCount = inventory.filter(
    (item) => item.status === "Out of Stock"
  ).length;

  const totalStock = inventory.reduce(
    (total, item) => total + item.stock,
    0
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "green";
      case "Low Stock":
        return "orange";
      case "Out of Stock":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Minimum Stock",
      dataIndex: "minimumStock",
      key: "minimumStock",
    },
    {
      title: "Warehouse",
      dataIndex: "warehouse",
      key: "warehouse",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Operations & Sales" },
          { label: "Inventory / Stock" },
        ]}
      />
      <div style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ marginBottom: "4px" }}>
          Inventory / Stock
        </Title>
        <Text type="secondary">
          Monitor product stock levels and low-stock alerts.
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Stock"
              value={totalStock}
              prefix={<InboxOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Low Stock"
              value={lowStockCount}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading}>
            <Statistic
              title="Out of Stock"
              value={outOfStockCount}
              prefix={<AlertOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        style={{ marginTop: "16px" }}
        title="Stock Overview"
        extra={
          <Input
            allowClear
            placeholder="Search inventory"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: 240 }}
          />
        }
      >
        <Table
          columns={columns}
          dataSource={filteredInventory}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}

export default Inventory;