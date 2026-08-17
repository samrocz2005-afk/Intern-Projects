import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/axios";
import Breadcrumbs from "../../components/Breadcrumbs";

const { Title, Text } = Typography;

function ShippingDeliveryDetails() {
  const { shipmentId } = useParams();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipment = async () => {
      if (!shipmentId) {
        message.error("Shipment ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        console.log("Shipment ID from URL:", shipmentId);

        const response = await api.get(
          `/shipping/${shipmentId}`
        );

        console.log(
          "Shipment Details API Response:",
          response?.data
        );

        const responseData = response?.data;

        const shipmentData =
          responseData?.data?.shipment ||
          responseData?.data ||
          responseData?.shipment ||
          null;

        if (
          !shipmentData ||
          typeof shipmentData !== "object"
        ) {
          setShipment(null);
          message.error("Shipment not found");
          return;
        }

        setShipment(shipmentData);
      } catch (error) {
        console.error(
          "Fetch Shipment Details Error:",
          error
        );

        console.error(
          "Backend Response:",
          error?.response?.data
        );

        message.error(
          error?.response?.data?.message ||
            "Failed to fetch shipment details"
        );

        setShipment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [shipmentId]);

  // ------------------------------------------
  // Loading
  // ------------------------------------------

  if (loading) {
    return (
      <div>
        <Breadcrumbs />

        <Card
          style={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin size="large" />
        </Card>
      </div>
    );
  }

  // ------------------------------------------
  // Not found
  // ------------------------------------------

  if (!shipment) {
    return (
      <div>
        <Breadcrumbs />

        <Card>
          <Title level={4}>
            Shipment not found
          </Title>

          <Text type="secondary">
            Unable to find shipment with ID:{" "}
            {shipmentId}
          </Text>

          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/shipping")}
            >
              Back to Shipping
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ------------------------------------------
  // Status
  // ------------------------------------------

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "green";

      case "In Transit":
        return "blue";

      case "Processing":
        return "orange";

      case "Delayed":
        return "red";

      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircleOutlined />;

      case "In Transit":
        return <TruckOutlined />;

      case "Processing":
        return <ClockCircleOutlined />;

      case "Delayed":
        return <EnvironmentOutlined />;

      default:
        return null;
    }
  };

  // ------------------------------------------
  // Shipment
  // ------------------------------------------

  const shipmentNumber =
    shipment.shipmentNumber ||
    shipment.shipmentId ||
    shipment._id ||
    shipmentId;

  // ------------------------------------------
  // Order
  // ------------------------------------------

  const order = shipment.order;

  let orderNumber = "N/A";

  if (
    typeof order === "object" &&
    order !== null
  ) {
    orderNumber =
      order.orderNumber ||
      order.orderId ||
      order._id ||
      "N/A";
  } else if (typeof order === "string") {
    orderNumber = order;
  } else {
    orderNumber =
      shipment.orderNumber || "N/A";
  }

  // ------------------------------------------
  // Customer
  // ------------------------------------------

  const customer = shipment.customer;

  let customerName = "N/A";

  if (
    typeof customer === "object" &&
    customer !== null
  ) {
    const firstName =
      customer.firstName ||
      customer.name ||
      "";

    const lastName =
      customer.lastName || "";

    customerName =
      `${firstName} ${lastName}`.trim() ||
      customer.email ||
      "N/A";
  } else if (typeof customer === "string") {
    customerName = customer;
  }

  // ------------------------------------------
  // Address
  // ------------------------------------------

  const shippingAddress =
    shipment.shippingAddress;

  const addressText = shippingAddress
    ? [
        shippingAddress.name,
        shippingAddress.address,
        shippingAddress.addressLine1,
        shippingAddress.addressLine2,
        shippingAddress.city,
        shippingAddress.state,
        shippingAddress.pincode,
        shippingAddress.postalCode,
        shippingAddress.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "N/A";

  // ------------------------------------------
  // Expected Delivery
  // ------------------------------------------

  const expectedDelivery =
    shipment.expectedDelivery
      ? new Date(
          shipment.expectedDelivery
        ).toLocaleDateString("en-IN")
      : "N/A";

  // ------------------------------------------
  // Render
  // ------------------------------------------

  return (
    <div>
      <Breadcrumbs />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div>
          <Title
            level={3}
            style={{ margin: 0 }}
          >
            Shipping & Delivery Details
          </Title>

          <Text type="secondary">
            View shipment and delivery information.
          </Text>
        </div>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/shipping")}
        >
          Back to Shipping
        </Button>
      </div>

      <Card>
        <Descriptions
          title="Shipment Information"
          bordered
          column={{
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
            xl: 2,
            xxl: 2,
          }}
        >
          <Descriptions.Item label="Shipment ID">
            <Text strong>
              {shipmentNumber}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label="Order">
            {orderNumber}
          </Descriptions.Item>

          <Descriptions.Item label="Customer">
            {customerName}
          </Descriptions.Item>

          <Descriptions.Item label="Carrier">
            {shipment.carrier || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Tracking ID">
            {shipment.trackingId || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Zone">
            {shippingAddress?.state ||
              shipment.zone ||
              "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            <Tag
              color={getStatusColor(
                shipment.status
              )}
              icon={getStatusIcon(
                shipment.status
              )}
            >
              {shipment.status ||
                "Processing"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Shipping Cost">
            ₹
            {Number(
              shipment.shippingCost || 0
            ).toLocaleString("en-IN")}
          </Descriptions.Item>

          <Descriptions.Item label="Expected Delivery">
            {expectedDelivery}
          </Descriptions.Item>

          <Descriptions.Item label="Shipping Address">
            {addressText}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}

export default ShippingDeliveryDetails;