import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Discounts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [discounts, setDiscounts] = useState([]);

  const debouncedSearch = useDebounce(search, 500);

  const fetchDiscountsData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/discounts");
      const result = response.data.data || response.data || [];

      const formattedDiscounts = result.map((item, index) => {
        let formattedExpiry = "N/A";
        if (item.expiry || item.expiresAt) {
          const dateObj = new Date(item.expiry || item.expiresAt);
          if (!isNaN(dateObj.getTime())) {
            formattedExpiry = dateObj.toLocaleDateString("en-GB").replace(/\//g, "-");
          }
        }

        return {
          key: item._id || String(index + 1),
          code: item.code || "N/A",
          type: item.type || "Percentage",
          value: item.value ?? 0,
          minOrder: item.minOrder || item.minimumOrderAmount || 0,
          usage: item.usage || item.usedCount || 0,
          status: item.status || "Active",
          expiry: formattedExpiry,
        };
      });

      setDiscounts(formattedDiscounts);
    } catch (error) {
      console.error("Fetch Discounts Error Details:", error.response || error);
      message.error(
        error.response?.data?.message || "Failed to fetch discounts data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscountsData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/discounts/${id}`);
      message.success("Discount deleted successfully");
      fetchDiscountsData();
    } catch (error) {
      console.error("Delete Error:", error.response || error);
      message.error(error.response?.data?.message || "Failed to delete discount");
    }
  };

  const filteredDiscounts = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (!value) {
      return discounts;
    }

    return discounts.filter(
      (discount) =>
        discount.code.toLowerCase().includes(value) ||
        discount.type.toLowerCase().includes(value)
    );
  }, [discounts, debouncedSearch]);

  const columns = [
    {
      title: "Coupon Code",
      dataIndex: "code",
      key: "code",
      render: (code) => <Text strong>{code}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Discount",
      dataIndex: "value",
      key: "value",
      render: (value, record) =>
        record.type === "Percentage"
          ? `${value}%`
          : `₹${value.toLocaleString("en-IN")}`,
    },
    {
      title: "Minimum Order",
      dataIndex: "minOrder",
      key: "minOrder",
      render: (value) => `₹${value.toLocaleString("en-IN")}`,
    },
    {
      title: "Usage",
      dataIndex: "usage",
      key: "usage",
    },
    {
      title: "Expiry",
      dataIndex: "expiry",
      key: "expiry",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Breadcrumbs
        items={[
          { label: "Operations & Sales" },
          { label: "Discounts & Coupons" },
        ]}
        style={{ marginBottom: "16px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Discounts & Coupons
          </Title>

          <Text type="secondary">
            Manage promotional codes and discounts.
          </Text>
        </div>

        <Space wrap>
          <Input
            allowClear
            placeholder="Search coupons"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: 220 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/Operations&Sales/discounts/add-coupon")}
          >
            Add Coupon
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredDiscounts}
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
        }}
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
}

export default Discounts;