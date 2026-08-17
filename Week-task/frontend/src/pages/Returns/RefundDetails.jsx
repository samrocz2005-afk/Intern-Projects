import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Descriptions,
  Divider,
  Row,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";

import { useLocation, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;

function RefundDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [returnData, setReturnData] = useState(null);
  const [loading, setLoading] = useState(false);

  /*
   * --------------------------------------------------
   * Breadcrumb Source
   * --------------------------------------------------
   */

  const breadcrumbSource =
    location.state?.from || "/returns";

  const getParentBreadcrumb = () => {
    switch (breadcrumbSource) {
      case "/returns":
      case "all":
        return {
          label: "Returns & Refunds",
          path: "/returns",
        };

      default:
        return {
          label: "Returns & Refunds",
          path: "/returns",
        };
    }
  };

  const parentBreadcrumb =
    getParentBreadcrumb();

  /*
   * --------------------------------------------------
   * Fetch Return Details
   * --------------------------------------------------
   */

  useEffect(() => {
    const fetchReturnDetails = async () => {
      if (!id) {
        message.error("Return ID is missing");
        return;
      }

      try {
        setLoading(true);

        const response = await api.get(
          `/returns/${id}`
        );

        if (response.data?.success) {
          setReturnData(
            response.data.data
          );
        } else {
          message.error(
            response.data?.message ||
              "Failed to fetch return details"
          );
        }
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch return details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReturnDetails();
  }, [id]);

  /*
   * --------------------------------------------------
   * Helpers
   * --------------------------------------------------
   */

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "blue";

      case "Pending":
        return "orange";

      case "Processing":
        return "cyan";

      case "Completed":
        return "green";

      case "Rejected":
        return "red";

      case "Cancelled":
        return "red";

      default:
        return "default";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Refund":
        return "purple";

      case "Exchange":
        return "blue";

      case "Return":
        return "orange";

      default:
        return "default";
    }
  };

  const formatAmount = (amount) => {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
      return "₹0";
    }

    return `₹${value.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "N/A";
    }

    return parsedDate.toLocaleString(
      "en-IN"
    );
  };

  const getCustomerName = (customer) => {
    if (!customer) {
      return "N/A";
    }

    if (typeof customer === "string") {
      return (
        customer.trim() || "N/A"
      );
    }

    if (customer.name) {
      return customer.name;
    }

    if (customer.fullName) {
      return customer.fullName;
    }

    const fullName =
      `${customer.firstName || ""} ${
        customer.lastName || ""
      }`.trim();

    return (
      fullName ||
      customer.email ||
      customer.phone ||
      "N/A"
    );
  };

  const getOrderNumber = (order) => {
    if (!order) {
      return "N/A";
    }

    if (typeof order === "string") {
      return order;
    }

    return (
      order.orderNumber ||
      order._id ||
      "N/A"
    );
  };

  const getProductName = (product) => {
    if (!product) {
      return "N/A";
    }

    if (typeof product === "string") {
      return (
        product.trim() || "N/A"
      );
    }

    return (
      product.name ||
      product.title ||
      product._id ||
      "N/A"
    );
  };

  /*
   * --------------------------------------------------
   * Loading State
   * --------------------------------------------------
   */

  if (loading) {
    return (
      <>
        <Breadcrumbs
          items={[
            {
              label: "Returns & Refunds",
              path: "/returns",
            },
            {
              label: "Refund Details",
            },
          ]}
        />

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
   * Not Found
   * --------------------------------------------------
   */

  if (!returnData) {
    return (
      <>
        <Breadcrumbs
          items={[
            {
              label:
                parentBreadcrumb.label,
              path:
                parentBreadcrumb.path,
            },
            {
              label: "Refund Details",
            },
          ]}
        />

        <Card>
          <Text type="secondary">
            Return or refund details not found.
          </Text>
        </Card>
      </>
    );
  }

  /*
   * --------------------------------------------------
   * Data
   * --------------------------------------------------
   */

  const customer =
    returnData.customer;

  const order =
    returnData.order;

  const product =
    returnData.product;

  const returnId =
    returnData.returnId ||
    returnData._id ||
    "N/A";

  const status =
    returnData.status ||
    "Pending";

  const type =
    returnData.type ||
    "Refund";

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumbs
        items={[
          {
            label:
              parentBreadcrumb.label,
            path:
              parentBreadcrumb.path,
          },
          {
            label: "Refund Details",
          },
        ]}
      />

      <Card>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Title
              level={3}
              style={{
                margin: 0,
              }}
            >
              Refund Details
            </Title>

            <Text type="secondary">
              {returnId}
            </Text>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <Tag
              color={getTypeColor(type)}
            >
              {type}
            </Tag>

            <Tag
              color={getStatusColor(
                status
              )}
            >
              {status}
            </Tag>
          </div>
        </div>

        <Divider />

        {/* Customer + Return Information */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Customer Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Name">
                  {getCustomerName(
                    customer
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Email">
                  {customer?.email ||
                    "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Phone">
                  {customer?.phone ||
                    "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Return Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Return ID">
                  {returnId}
                </Descriptions.Item>

                <Descriptions.Item label="Type">
                  <Tag
                    color={getTypeColor(
                      type
                    )}
                  >
                    {type}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                  <Tag
                    color={getStatusColor(
                      status
                    )}
                  >
                    {status}
                  </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Request Date">
                  {formatDate(
                    returnData.createdAt ||
                      returnData.date
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Processed Date">
                  {formatDate(
                    returnData.completedAt ||
                      returnData.processedAt
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Order + Product Information */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Order Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Order ID">
                  {getOrderNumber(order) !==
                  "N/A"
                    ? getOrderNumber(order)
                    : returnData.orderId ||
                      "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Order Date">
                  {formatDate(
                    order?.createdAt
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Product Information">
              <Descriptions column={1}>
                <Descriptions.Item label="Product">
                  {getProductName(
                    product
                  )}
                </Descriptions.Item>

                <Descriptions.Item label="Quantity">
                  {returnData.quantity ??
                    "N/A"}
                </Descriptions.Item>

                <Descriptions.Item label="Reason">
                  {returnData.reason?.trim() ||
                    "N/A"}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Refund Information */}
        <Card title="Refund Information">
          <Descriptions column={1}>
            <Descriptions.Item label="Refund Amount">
              <Text strong>
                {formatAmount(
                  returnData.amount
                )}
              </Text>
            </Descriptions.Item>

            <Descriptions.Item label="Refund Method">
              {returnData.refundMethod ||
                returnData.paymentMethod ||
                "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Refund Status">
              <Tag
                color={getStatusColor(
                  status
                )}
              >
                {status}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Refund Date">
              {formatDate(
                returnData.refundedAt ||
                  returnData.completedAt
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Transaction ID">
              {returnData.transactionId ||
                returnData.refundTransactionId ||
                "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        {/* Additional Information */}
        <Card title="Additional Information">
          <Descriptions column={1}>
            <Descriptions.Item label="Reason">
              {returnData.reason?.trim() ||
                "N/A"}
            </Descriptions.Item>

            <Descriptions.Item label="Notes">
              {returnData.notes?.trim() ||
                returnData.description?.trim() ||
                "N/A"}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Card>
    </>
  );
}

export default RefundDetails;