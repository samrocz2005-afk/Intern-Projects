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

function CompletedOrders() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        setLoading(true);

        const response = await api.get("/orders");

        if (response.data?.success) {
          const orderData = response.data.data;

          const orderList = Array.isArray(orderData)
            ? orderData
            : orderData?.orders || [];

          const completedOrders = orderList.filter(
            (order) =>
              order.status === "Completed" ||
              order.status === "Delivered"
          );

          setOrders(completedOrders);
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch completed orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
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

  const getPaymentColor = (paymentStatus) => {
    switch (paymentStatus) {
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
            navigate(
              `/orders/completed/${record._id}`
            )
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
        <Tag color="green">
          {status || "Completed"}
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
          <Title
            level={3}
            style={{ margin: 0 }}
          >
            Completed Orders
          </Title>

          <Input
            allowClear
            placeholder="Search order or customer"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              width: 260,
            }}
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

export default CompletedOrders;