import React, { useEffect, useState } from "react";

import {
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Spin,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import { useLocation, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;

function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Identify which Orders page opened the details page
  const breadcrumbSource = location.state?.from || "all";

  const getParentBreadcrumb = () => {
    switch (breadcrumbSource) {
      case "pending":
        return {
          label: "Pending Orders",
          path: "/orders/pending",
        };

      case "completed":
        return {
          label: "Completed Orders",
          path: "/orders/completed",
        };

      case "all":
      default:
        return {
          label: "All Orders",
          path: "/orders/all-orders",
        };
    }
  };

  const parentBreadcrumb = getParentBreadcrumb();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) {
        message.error("Order ID is missing");
        return;
      }

      try {
        setLoading(true);

        const response = await api.get(`/orders/${id}`);

        if (response.data?.success) {
          setOrder(response.data.data);
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

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

  const getPaymentColor = (status) => {
    switch (status) {
      case "Paid":
        return "green";

      case "Pending":
        return "gold";

      case "Refunded":
        return "orange";

      case "Failed":
        return "red";

      default:
        return "default";
    }
  };

  const itemColumns = [
    {
      title: "Product",
      key: "product",

      render: (_, record) => {
        const product = record.product;

        return (
          <div>
            <Text strong>
              {product?.name || record.name || "N/A"}
            </Text>
          </div>
        );
      },
    },

    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",

      render: (price) =>
        `₹${Number(price || 0).toLocaleString(
          "en-IN"
        )}`,
    },

    {
      title: "Subtotal",
      key: "subtotal",

      render: (_, record) =>
        `₹${(
          Number(record.quantity || 0) *
          Number(record.price || 0)
        ).toLocaleString("en-IN")}`,
    },
  ];

  /*
   * --------------------------------------------------
   * Loading State
   * --------------------------------------------------
   */

  if (loading) {
    return (
      <>
        <Breadcrumbs />

        <Card>
          <div
            style={{
              minHeight: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spin size="large" />
          </div>
        </Card>
      </>
    );
  }

  /*
   * --------------------------------------------------
   * Order Not Found
   * --------------------------------------------------
   */

  if (!order) {
    return (
      <>
        <Breadcrumbs />

        <Card>
          <Text type="secondary">
            Order not found.
          </Text>
        </Card>
      </>
    );
  }

  const customer = order.customer;

  return (
    <>
      {/* Global Breadcrumb */}
      <Breadcrumbs />

      <Card>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Order Details
            </Title>

            <Text type="secondary">
              {order.orderNumber || order._id}
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            <Tag color={getStatusColor(order.status)}>
              {order.status || "Pending"}
            </Tag>

            <Tag
              color={getPaymentColor(
                order.paymentStatus
              )}
            >
              {order.paymentStatus || "Pending"}
            </Tag>
          </div>
        </div>

        <Divider />

        {/* Customer + Order Information */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Customer Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Name">
                  {getCustomerName(customer)}
                </Descriptions.Item>

                <Descriptions.Item label="Email">
                  {customer?.email || "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Phone">
                  {customer?.phone || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Order Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Order ID">
                  {order.orderNumber || order._id}
                </Descriptions.Item>

                <Descriptions.Item label="Order Date">
                  {order.createdAt
                    ? new Date(
                        order.createdAt
                      ).toLocaleString("en-IN")
                    : "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag
                    color={getStatusColor(
                      order.status
                    )}
                  >
                    {order.status || "Pending"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Payment">
                  <Tag
                    color={getPaymentColor(
                      order.paymentStatus
                    )}
                  >
                    {order.paymentStatus || "Pending"}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Payment Method">
                  {order.paymentMethod || "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Order Items */}
        <Card title="Order Items">
          <Table
            rowKey={(record, index) =>
              record._id ||
              record.product?._id ||
              index
            }
            columns={itemColumns}
            dataSource={order.items || []}
            pagination={false}
            scroll={{
              x: "max-content",
            }}
          />
        </Card>

        <Divider />

        {/* Order Summary */}
        <Row justify="end">
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card title="Order Summary">
              <Descriptions column={1}>
                <Descriptions.Item label="Subtotal">
                  ₹
                  {Number(
                    order.subtotal || 0
                  ).toLocaleString("en-IN")}
                </Descriptions.Item>

                <Descriptions.Item label="Discount">
                  ₹
                  {Number(
                    order.discount || 0
                  ).toLocaleString("en-IN")}
                </Descriptions.Item>

                <Descriptions.Item label="Shipping">
                  ₹
                  {Number(
                    order.shippingCost || 0
                  ).toLocaleString("en-IN")}
                </Descriptions.Item>

                <Descriptions.Item label="Total">
                  <Text strong>
                    ₹
                    {Number(
                      order.total || 0
                    ).toLocaleString("en-IN")}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  );
}

export default OrderDetails;