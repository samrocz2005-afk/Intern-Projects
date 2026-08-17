import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Col,
  Input,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  SendOutlined,
  TruckOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import api from "../../services/axios";
import useDebounce from "../../hooks/useDebounce";
import Breadcrumbs from "../../components/Breadcrumbs";

const { Title, Text } = Typography;

function ShippingDelivery() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        setLoading(true);

        let response;

        try {
          response = await api.get("/shipping");
        } catch (shippingError) {
          console.warn(
            "Shipping API failed. Trying orders API...",
            shippingError
          );

          response = await api.get("/orders");
        }

        const responseData =
          response?.data?.data?.shipments ||
          response?.data?.shipments ||
          response?.data?.data ||
          response?.data ||
          [];

        console.log(
          "Shipping API response:",
          responseData
        );

        if (!Array.isArray(responseData)) {
          setShipments([]);
          return;
        }

        const formattedShipments = responseData.map(
          (item, index) => {
            // --------------------------------
            // REAL DATABASE SHIPMENT ID
            // --------------------------------

            const shipmentId = item?._id;

            // --------------------------------
            // DISPLAY SHIPMENT NUMBER
            // --------------------------------

            const shipmentNumber =
              item?.shipmentNumber ||
              item?.shipmentId ||
              item?._id ||
              `SHIP00${index + 1}`;

            // --------------------------------
            // CUSTOMER
            // --------------------------------

            const customer =
              item?.customer ||
              item?.order?.customer;

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
            } else if (
              typeof customer === "string"
            ) {
              customerName = customer;
            } else if (
              item?.shippingAddress?.name
            ) {
              customerName =
                item.shippingAddress.name;
            }

            // --------------------------------
            // ORDER
            // --------------------------------

            const order = item?.order;

            const orderId =
              typeof order === "object" &&
              order !== null
                ? order.orderNumber ||
                  order._id ||
                  item?.orderNumber ||
                  `ORD00${index + 1}`
                : order ||
                  item?.orderNumber ||
                  `ORD00${index + 1}`;

            // --------------------------------
            // RETURN OBJECT
            // --------------------------------

            return {
              key:
                shipmentId ||
                shipmentNumber,

              // IMPORTANT:
              // Used for API/navigation
              shipmentId,

              // IMPORTANT:
              // Used only for display
              shipmentNumber,

              orderId,

              customer: customerName,

              carrier:
                item?.carrier ||
                "Standard Carrier",

              zone:
                item?.shippingAddress?.state ||
                item?.zone ||
                "N/A",

              trackingId:
                item?.trackingId ||
                "N/A",

              shippingCost:
                item?.shippingCost || 0,

              status:
                item?.status ||
                "Processing",

              expectedDate:
                item?.expectedDelivery
                  ? new Date(
                      item.expectedDelivery
                    ).toLocaleDateString("en-IN")
                  : "N/A",
            };
          }
        );

        console.log(
          "Formatted shipments:",
          formattedShipments
        );

        setShipments(formattedShipments);
      } catch (error) {
        console.error(
          "Fetch Shipments Error:",
          error
        );

        message.error(
          "Failed to fetch shipping data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  // ----------------------------------------
  // Search
  // ----------------------------------------

  const filteredShipments = useMemo(() => {
    const value = debouncedSearch
      .trim()
      .toLowerCase();

    if (!value) {
      return shipments;
    }

    return shipments.filter((shipment) => {
      return (
        String(shipment.shipmentNumber)
          .toLowerCase()
          .includes(value) ||
        String(shipment.orderId)
          .toLowerCase()
          .includes(value) ||
        String(shipment.customer)
          .toLowerCase()
          .includes(value) ||
        String(shipment.carrier)
          .toLowerCase()
          .includes(value) ||
        String(shipment.trackingId)
          .toLowerCase()
          .includes(value)
      );
    });
  }, [shipments, debouncedSearch]);

  // ----------------------------------------
  // Statistics
  // ----------------------------------------

  const deliveredCount =
    shipments.filter(
      (shipment) =>
        shipment.status === "Delivered"
    ).length;

  const transitCount =
    shipments.filter(
      (shipment) =>
        shipment.status === "In Transit"
    ).length;

  const delayedCount =
    shipments.filter(
      (shipment) =>
        shipment.status === "Delayed"
    ).length;

  // ----------------------------------------
  // Status Color
  // ----------------------------------------

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

  // ----------------------------------------
  // Status Icon
  // ----------------------------------------

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

  // ----------------------------------------
  // Columns
  // ----------------------------------------

  const columns = [
    {
      title: "Shipment",
      dataIndex: "shipmentNumber",
      key: "shipmentNumber",

      render: (shipmentNumber, record) => (
        <Text
          strong
          style={{
            color: "#1677ff",
            cursor: "pointer",
          }}
          onClick={() => {
            console.log(
              "Clicked Shipment Number:",
              shipmentNumber
            );

            console.log(
              "MongoDB Shipment ID:",
              record.shipmentId
            );

            // IMPORTANT:
            // Navigate using MongoDB _id,
            // NOT shipmentNumber.
            if (!record.shipmentId) {
              message.error(
                "Shipment database ID is missing"
              );
              return;
            }

            navigate(
              `/shipping/${record.shipmentId}`
            );
          }}
        >
          {shipmentNumber}
        </Text>
      ),
    },

    {
      title: "Order",
      dataIndex: "orderId",
      key: "orderId",
    },

    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },

    {
      title: "Carrier",
      dataIndex: "carrier",
      key: "carrier",

      render: (carrier) => (
        <Space>
          <TruckOutlined />
          {carrier}
        </Space>
      ),
    },

    {
      title: "Zone",
      dataIndex: "zone",
      key: "zone",
    },

    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
    },

    {
      title: "Shipping Cost",
      dataIndex: "shippingCost",
      key: "shippingCost",

      render: (cost) =>
        `₹${Number(
          cost || 0
        ).toLocaleString("en-IN")}`,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          icon={getStatusIcon(status)}
        >
          {status}
        </Tag>
      ),
    },

    {
      title: "Expected Delivery",
      dataIndex: "expectedDate",
      key: "expectedDate",
    },
  ];

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <div>
      <Breadcrumbs />

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title
            level={3}
            style={{ margin: 0 }}
          >
            Shipping & Delivery
          </Title>

          <Text type="secondary">
            Manage shipping zones, carriers,
            rates, and delivery tracking.
          </Text>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Shipments"
              value={shipments.length}
              prefix={<SendOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Delivered"
              value={deliveredCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{
                color: "#3f8600",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="In Transit"
              value={transitCount}
              prefix={<TruckOutlined />}
              valueStyle={{
                color: "#1677ff",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Delayed"
              value={delayedCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{
                color: "#ff4d4f",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Table */}
      <Card
        title="Shipment Tracking"
        style={{ marginTop: "16px" }}
        extra={
          <Input
            allowClear
            placeholder="Search shipments"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{ width: 250 }}
          />
        }
      >
        <Table
          rowKey="key"
          columns={columns}
          dataSource={filteredShipments}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
          }}
          scroll={{
            x: "max-content",
          }}
        />
      </Card>
    </div>
  );
}

export default ShippingDelivery;