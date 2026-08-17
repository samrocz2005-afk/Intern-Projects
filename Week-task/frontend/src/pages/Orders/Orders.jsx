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

function Orders() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get current user and role
  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userRole = user.role
    ? user.role.toLowerCase()
    : "customer";

  const isAdminOrManager = [
    "admin",
    "manager",
  ].includes(userRole);

  const currentUserId = user._id || user.id;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const response = await api.get("/orders");

        if (response.data?.success) {
          const orderData = response.data.data;

          let orderList = Array.isArray(orderData)
            ? orderData
            : orderData?.orders || [];

          // Filter orders for regular customers
          if (!isAdminOrManager) {
            orderList = orderList.filter((order) => {
              const orderCust = order.customer;

              if (!orderCust) {
                return false;
              }

              let custId = "";

              if (typeof orderCust === "string") {
                custId = orderCust;
              } else {
                custId =
                  orderCust._id ||
                  orderCust.id ||
                  orderCust.toString();
              }

              return (
                custId === currentUserId ||
                custId === user.customerRef ||
                (user.email &&
                  orderCust.email === user.email)
              );
            });
          }

          setOrders(orderList);
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getCustomerName = (customer) => {
    if (!customer) {
      return "N/A";
    }

    if (typeof customer === "string") {
      return `ID: ${customer.substring(0, 6)}...`;
    }

    if (customer.name) {
      return customer.name;
    }

    if (customer.fullName) {
      return customer.fullName;
    }

    if (customer.username) {
      return customer.username;
    }

    const fullName = `${customer.firstName || ""} ${
      customer.lastName || ""
    }`.trim();

    if (fullName) {
      return fullName;
    }

    return (
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
      case "Completed":
      case "Delivered":
        return "green";

      case "Processing":
        return "blue";

      case "Pending":
        return "orange";

      case "Cancelled":
        return "red";

      case "Shipped":
        return "cyan";

      case "Returned":
        return "purple";

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

      case "Pending":
        return "gold";

      case "Failed":
        return "red";

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
            navigate(`/orders/all-orders/${record._id}`, {
              state: {
                from: "all",
              },
            })
          }
        >
          {orderNumber || record._id}
        </Button>
      ),
    },

    // Customer column only for Admin/Manager
    ...(isAdminOrManager
      ? [
          {
            title: "Customer",
            key: "customer",

            render: (_, record) =>
              getCustomerName(record.customer),
          },
        ]
      : []),

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
        <Tag color={getPaymentColor(paymentStatus)}>
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
      {/* Global Breadcrumb */}
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
            {isAdminOrManager
              ? "All Orders"
              : "My Orders"}
          </Title>

          <Input
            allowClear
            placeholder={
              isAdminOrManager
                ? "Search order or customer"
                : "Search order"
            }
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{ width: 260 }}
          />
        </div>

        <Table
          rowKey={(record) => record._id}
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

export default Orders;