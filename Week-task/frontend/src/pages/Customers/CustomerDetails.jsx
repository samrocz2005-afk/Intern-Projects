import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;

function CustomerDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/customers/${id}`);

        if (response.data?.success) {
          setCustomer(
            response.data.data || response.data.customer
          );
        } else {
          message.error(
            response.data?.message ||
              "Failed to fetch customer details"
          );
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch customer details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  if (loading) {
    return (
      <Card>
        <div
          style={{
            minHeight: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!customer) {
    return (
      <>
        <Breadcrumbs
          items={[
            { label: "Customers", path: "/customers" },
            { label: "Customer Details" },
          ]}
        />

        <Card>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/customers")}
          >
            Back to Customers
          </Button>

          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
            }}
          >
            <Title level={4}>Customer not found</Title>

            <Text type="secondary">
              The requested customer could not be found.
            </Text>
          </div>
        </Card>
      </>
    );
  }

  const fullName =
    `${customer.firstName || ""} ${
      customer.lastName || ""
    }`.trim() || "N/A";

  const address = customer.address || {};

  const orders = Array.isArray(customer.orders)
    ? customer.orders
    : [];

  const products = Array.isArray(customer.products)
    ? customer.products
    : Array.isArray(customer.orderItems)
    ? customer.orderItems
    : [];

  const totalOrders =
    customer.ordersCount ??
    customer.totalOrders ??
    orders.length ??
    0;

  const totalSpent =
    customer.totalSpent ??
    customer.totalAmount ??
    customer.totalPurchase ??
    0;

  const status = customer.status || "Inactive";

  // ------------------------------------------
  // Product Columns
  // ------------------------------------------

  const productColumns = [
    {
      title: "Product",
      key: "product",
      render: (_, record) => {
        const product =
          record.product ||
          record.productDetails ||
          {};

        const name =
          product.name ||
          product.title ||
          record.productName ||
          "N/A";

        const image =
          product.image ||
          product.thumbnail ||
          product.poster ||
          null;

        const category =
          typeof product.category === "string"
            ? product.category
            : product.category?.name || "";

        return (
          <Space>
            {image ? (
              <Avatar
                shape="square"
                size={48}
                src={image}
              />
            ) : (
              <Avatar
                shape="square"
                size={48}
                icon={<ShoppingOutlined />}
              />
            )}

            <div>
              <div style={{ fontWeight: 500 }}>
                {name}
              </div>

              {category && (
                <Text type="secondary">
                  {category}
                </Text>
              )}
            </div>
          </Space>
        );
      },
    },

    {
      title: "Quantity",
      key: "quantity",
      render: (_, record) =>
        record.quantity ??
        record.qty ??
        1,
    },

    {
      title: "Price",
      key: "price",
      render: (_, record) => {
        const product =
          record.product ||
          record.productDetails ||
          {};

        const price =
          record.price ??
          record.unitPrice ??
          product.price ??
          0;

        return `₹${Number(price).toLocaleString(
          "en-IN"
        )}`;
      },
    },

    {
      title: "Total",
      key: "total",
      render: (_, record) => {
        const product =
          record.product ||
          record.productDetails ||
          {};

        const price =
          record.price ??
          record.unitPrice ??
          product.price ??
          0;

        const quantity =
          record.quantity ??
          record.qty ??
          1;

        const total =
          record.total ??
          record.totalPrice ??
          Number(price) * Number(quantity);

        return (
          <Text strong>
            ₹{Number(total).toLocaleString("en-IN")}
          </Text>
        );
      },
    },

    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const orderStatus =
          record.status ||
          record.orderStatus ||
          "Completed";

        const normalizedStatus =
          String(orderStatus).toLowerCase();

        let color = "green";

        if (normalizedStatus === "pending") {
          color = "orange";
        }

        if (
          normalizedStatus === "cancelled" ||
          normalizedStatus === "canceled"
        ) {
          color = "red";
        }

        if (normalizedStatus === "processing") {
          color = "blue";
        }

        return (
          <Tag color={color}>
            {orderStatus}
          </Tag>
        );
      },
    },
  ];

  // ------------------------------------------
  // Order Columns
  // ------------------------------------------

  const orderColumns = [
    {
      title: "Order ID",
      key: "orderId",
      render: (_, record) =>
        record.orderId ||
        record._id ||
        record.id ||
        "N/A",
    },

    {
      title: "Date",
      key: "date",
      render: (_, record) => {
        const date =
          record.createdAt ||
          record.orderDate ||
          record.date;

        if (!date) {
          return "N/A";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
          return "N/A";
        }

        return parsedDate.toLocaleDateString("en-IN");
      },
    },

    {
      title: "Items",
      key: "items",
      render: (_, record) => {
        const items =
          record.items ||
          record.products ||
          record.orderItems ||
          [];

        return Array.isArray(items)
          ? items.length
          : record.itemCount || 0;
      },
    },

    {
      title: "Amount",
      key: "amount",
      render: (_, record) => {
        const amount =
          record.totalAmount ??
          record.total ??
          record.amount ??
          0;

        return (
          <Text strong>
            ₹{Number(amount).toLocaleString(
              "en-IN"
            )}
          </Text>
        );
      },
    },

    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const orderStatus =
          record.status || "Completed";

        const normalizedStatus =
          String(orderStatus).toLowerCase();

        let color = "green";

        if (normalizedStatus === "pending") {
          color = "orange";
        }

        if (
          normalizedStatus === "cancelled" ||
          normalizedStatus === "canceled"
        ) {
          color = "red";
        }

        if (normalizedStatus === "processing") {
          color = "blue";
        }

        return (
          <Tag color={color}>
            {orderStatus}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Customers"},
          {label: "All Customers", path: "/customers"},
          { label: fullName !== "N/A" ? fullName : "Customer Details" },
        ]}
      />

      {/* ------------------------------------------
          Header
      ------------------------------------------- */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Space>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/customers")}
          >
            Back
          </Button>

          <Title
            level={3}
            style={{ margin: 0 }}
          >
            Customer Details
          </Title>
        </Space>
      </div>

      {/* ------------------------------------------
          Customer Profile
      ------------------------------------------- */}

      <Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Space size="large">
              <Avatar
                size={80}
                icon={<UserOutlined />}
              />

              <div>
                <Title
                  level={4}
                  style={{ margin: 0 }}
                >
                  {fullName}
                </Title>

                <Text type="secondary">
                  Customer ID: {customer._id || id}
                </Text>

                <div style={{ marginTop: 8 }}>
                  <Tag
                    color={
                      status === "Active"
                        ? "green"
                        : "red"
                    }
                  >
                    {status}
                  </Tag>
                </div>
              </div>
            </Space>
          </Col>

          <Col xs={24} md={16}>
            <Descriptions
              column={{
                xs: 1,
                sm: 2,
              }}
              size="small"
            >
              <Descriptions.Item label="First Name">
                {customer.firstName || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item label="Last Name">
                {customer.lastName || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <MailOutlined />
                    Email
                  </Space>
                }
              >
                {customer.email || "N/A"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <Space>
                    <PhoneOutlined />
                    Phone
                  </Space>
                }
              >
                {customer.phone || "N/A"}
              </Descriptions.Item>

              {/* Address is an OBJECT */}
              <Descriptions.Item label="Address">
                {address.addressLine1 ||
                address.addressLine2 ||
                address.city ||
                address.state ||
                address.postalCode ||
                address.country ? (
                  <div>
                    {address.addressLine1 && (
                      <div>
                        {address.addressLine1}
                      </div>
                    )}

                    {address.addressLine2 && (
                      <div>
                        {address.addressLine2}
                      </div>
                    )}

                    {(address.city ||
                      address.state ||
                      address.postalCode) && (
                      <div>
                        {[
                          address.city,
                          address.state,
                          address.postalCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    )}

                    {address.country && (
                      <div>
                        {address.country}
                      </div>
                    )}
                  </div>
                ) : (
                  "N/A"
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Country">
                {address.country || "N/A"}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      {/* ------------------------------------------
          Summary
      ------------------------------------------- */}

      <Row
        gutter={[16, 16]}
        style={{ marginTop: 20 }}
      >
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Orders"
              value={Number(totalOrders)}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Spent"
              value={Number(totalSpent)}
              prefix="₹"
              precision={2}
              formatter={(value) =>
                Number(value).toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Products Purchased"
              value={products.length}
            />
          </Card>
        </Col>
      </Row>

      {/* ------------------------------------------
          Purchased Products
      ------------------------------------------- */}

      <Card
        title="Purchased Products"
        style={{ marginTop: 20 }}
      >
        {products.length > 0 ? (
          <Table
            rowKey={(record, index) =>
              record._id ||
              record.productId ||
              record.product?._id ||
              index
            }
            columns={productColumns}
            dataSource={products}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
            }}
            scroll={{ x: "max-content" }}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
            }}
          >
            <ShoppingOutlined
              style={{
                fontSize: 40,
                marginBottom: 12,
              }}
            />

            <div>
              <Text type="secondary">
                No products purchased by this
                customer.
              </Text>
            </div>
          </div>
        )}
      </Card>

      {/* ------------------------------------------
          Order History
      ------------------------------------------- */}

      <Card
        title="Order History"
        style={{ marginTop: 20 }}
      >
        {orders.length > 0 ? (
          <Table
            rowKey={(record, index) =>
              record._id ||
              record.orderId ||
              index
            }
            columns={orderColumns}
            dataSource={orders}
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
            }}
            scroll={{ x: "max-content" }}
          />
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "50px 20px",
            }}
          >
            <ShoppingOutlined
              style={{
                fontSize: 40,
                marginBottom: 12,
              }}
            />

            <div>
              <Text type="secondary">
                No orders found for this customer.
              </Text>
            </div>
          </div>
        )}
      </Card>

      {/* ------------------------------------------
          Bottom Back Button
      ------------------------------------------- */}

      <Divider />

      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/customers")}
      >
        Back to Customers
      </Button>
    </div>
  );
}

export default CustomerDetails;