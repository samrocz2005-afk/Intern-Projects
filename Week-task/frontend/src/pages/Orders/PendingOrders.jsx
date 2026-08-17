import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  Input,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import {
  SearchOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title } = Typography;

function PendingOrders() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        setLoading(true);

        const response = await api.get("/orders");

        if (response.data?.success) {
          const orderData = response.data.data;

          const orderList = Array.isArray(orderData)
            ? orderData
            : orderData?.orders || [];

          const pendingOrders = orderList.filter(
            (order) =>
              order.status === "Pending" ||
              order.status === "Processing"
          );

          setOrders(pendingOrders);
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch pending orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPendingOrders();
  }, []);

  const getCustomerName = (customer) => {
    if (!customer) {
      return "N/A";
    }

    if (typeof customer === "string") {
      return customer;
    }

    if (customer.name) {
      return customer.name;
    }

    const fullName = `${customer.firstName || ""} ${
      customer.lastName || ""
    }`.trim();

    return (
      fullName ||
      customer.email ||
      customer.phone ||
      "N/A"
    );
  };

  const filteredOrders = orders.filter((order) => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return true;
    }

    const orderNumber = String(
      order.orderNumber || ""
    ).toLowerCase();

    const customerName = String(
      getCustomerName(order.customer)
    ).toLowerCase();

    return (
      orderNumber.includes(value) ||
      customerName.includes(value)
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "orange";

      case "Processing":
        return "blue";

      default:
        return "default";
    }
  };

  const getPaymentColor = (payment) => {
    switch (payment) {
      case "Paid":
        return "green";

      case "Refunded":
        return "orange";

      case "Failed":
        return "red";

      case "Pending":
        return "gold";

      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderNumber",
      key: "orderNumber",

      render: (orderNumber, record) => (
        <Button
          type="link"
          style={{
            padding: 0,
            height: "auto",
          }}
          onClick={() =>
            navigate(`/orders/pending/${record._id}`)
          }
        >
          {orderNumber || record._id}
        </Button>
      ),
    },

    {
      title: "Customer",
      key: "customer",

      render: (_, record) =>
        getCustomerName(record.customer),
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",

      render: (date) =>
        date
          ? new Date(date).toLocaleDateString("en-IN")
          : "N/A",
    },

    {
      title: "Total",
      dataIndex: "total",
      key: "total",

      render: (total) =>
        `₹${Number(total || 0).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Payment",
      dataIndex: "paymentStatus",
      key: "paymentStatus",

      render: (paymentStatus) => (
        <Tag
          color={getPaymentColor(paymentStatus)}
        >
          {paymentStatus || "Pending"}
        </Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status || "Pending"}
        </Tag>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs />

      <Card>
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
          <Title level={3} style={{ margin: 0 }}>
            Pending Orders
          </Title>

          <Input
            allowClear
            placeholder="Search order or customer"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{ width: 260 }}
          />
        </div>

        <Table
          rowKey={(record) =>
            record._id || record.orderNumber
          }
          loading={loading}
          columns={columns}
          dataSource={filteredOrders}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
          }}
          scroll={{
            x: "max-content",
          }}
        />
      </Card>
    </>
  );
}

export default PendingOrders;