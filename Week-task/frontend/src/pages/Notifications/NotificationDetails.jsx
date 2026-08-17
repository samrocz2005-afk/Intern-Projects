import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import api from "../../services/axios";
import Breadcrumbs from "../../components/Breadcrumbs";

const { Title, Text } = Typography;

function NotificationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==================================================
  // FETCH NOTIFICATION
  // ==================================================

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/notifications/${id}`
        );

        const data =
          response?.data?.data ||
          response?.data ||
          null;

        if (!data) {
          message.error("Notification not found");
          navigate("/notifications");
          return;
        }

        setNotification(data);

        // Automatically mark unread notification as read
        if (!data.isRead) {
          try {
            await api.patch(
              `/notifications/${id}/read`
            );

            setNotification((prev) =>
              prev
                ? {
                    ...prev,
                    isRead: true,
                  }
                : prev
            );
          } catch (readError) {
            console.error(
              "Failed to mark notification as read:",
              readError
            );
          }
        }
      } catch (error) {
        console.error(
          "Failed to fetch notification:",
          error
        );

        message.error(
          error.response?.data?.message ||
            "Failed to load notification"
        );

        navigate("/notifications");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNotification();
    }
  }, [id, navigate]);

  // ==================================================
  // TYPE COLOR
  // ==================================================

  const getTypeColor = (type) => {
    switch (type) {
      case "Order":
        return "blue";

      case "Inventory":
        return "orange";

      case "Payment":
        return "green";

      case "Return":
        return "purple";

      case "System":
        return "cyan";

      case "Success":
        return "green";

      case "Warning":
        return "orange";

      case "Error":
        return "red";

      case "Info":
        return "blue";

      default:
        return "default";
    }
  };

  // ==================================================
  // TYPE ICON
  // ==================================================

  const getTypeIcon = (type) => {
    switch (type) {
      case "Order":
        return <ShoppingCartOutlined />;

      case "Inventory":
        return <WarningOutlined />;

      case "Payment":
        return <CheckCircleOutlined />;

      case "Return":
        return <ExclamationCircleOutlined />;

      case "System":
        return <InfoCircleOutlined />;

      case "Error":
        return <ExclamationCircleOutlined />;

      case "Warning":
        return <WarningOutlined />;

      case "Success":
        return <CheckCircleOutlined />;

      default:
        return <BellOutlined />;
    }
  };

  // ==================================================
  // DATE FORMAT
  // ==================================================

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString();
  };

  const formatTime = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <>
        <Breadcrumbs />

        <Card>
          <div
            style={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin size="large" />
          </div>
        </Card>
      </>
    );
  }

  // ==================================================
  // NOT FOUND
  // ==================================================

  if (!notification) {
    return null;
  }

  // ==================================================
  // RECIPIENT
  // ==================================================

  const recipient =
    notification.recipient || null;

  const recipientName =
    `${recipient?.firstName || ""} ${
      recipient?.lastName || ""
    }`.trim();

  // ==================================================
  // UI
  // ==================================================

  return (
    <>
      <Breadcrumbs />

      <Card>
        {/* ============================================
            HEADER
        ============================================ */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Space align="center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() =>
                navigate("/notifications")
              }
            >
              Back
            </Button>

            <Title
              level={3}
              style={{ margin: 0 }}
            >
              Notification Details
            </Title>
          </Space>

          <Tag
            color={getTypeColor(
              notification.type
            )}
            icon={getTypeIcon(
              notification.type
            )}
          >
            {notification.type || "Info"}
          </Tag>
        </div>

        <Divider />

        {/* ============================================
            NOTIFICATION TITLE
        ============================================ */}

        <Space
          align="start"
          size="middle"
          style={{
            marginBottom: 24,
          }}
        >
          <Avatar
            size={48}
            icon={
              getTypeIcon(
                notification.type
              )
            }
          />

          <div>
            <Title
              level={4}
              style={{ margin: 0 }}
            >
              {notification.title}
            </Title>

            <Text type="secondary">
              {formatDate(
                notification.createdAt
              )}{" "}
              at{" "}
              {formatTime(
                notification.createdAt
              )}
            </Text>
          </div>
        </Space>

        {/* ============================================
            MESSAGE
        ============================================ */}

        <Card
          size="small"
          style={{
            marginBottom: 24,
          }}
        >
          <Title level={5}>
            Message
          </Title>

          <Text
            style={{
              whiteSpace: "pre-wrap",
              display: "block",
            }}
          >
            {notification.message}
          </Text>
        </Card>

        {/* ============================================
            DETAILS
        ============================================ */}

        <Descriptions
          title="Notification Information"
          bordered
          column={{
            xs: 1,
            sm: 1,
            md: 2,
          }}
        >
          <Descriptions.Item label="Notification ID">
            {notification._id || "-"}
          </Descriptions.Item>

          <Descriptions.Item label="Type">
            <Tag
              color={getTypeColor(
                notification.type
              )}
            >
              {notification.type || "Info"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {notification.isRead ? (
              <Tag
                color="success"
                icon={
                  <CheckCircleOutlined />
                }
              >
                Read
              </Tag>
            ) : (
              <Tag color="processing">
                Unread
              </Tag>
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Created Date">
            {formatDate(
              notification.createdAt
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Created Time">
            {formatTime(
              notification.createdAt
            )}
          </Descriptions.Item>

          <Descriptions.Item label="Read At">
            {notification.readAt
              ? `${formatDate(
                  notification.readAt
                )} ${formatTime(
                  notification.readAt
                )}`
              : "-"}
          </Descriptions.Item>

          {recipient && (
            <>
              <Descriptions.Item label="Recipient">
                <Space>
                  <Avatar
                    size="small"
                    icon={<UserOutlined />}
                  />

                  <span>
                    {recipientName ||
                      recipient.email ||
                      "Customer"}
                  </span>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Email">
                {recipient.email || "-"}
              </Descriptions.Item>
            </>
          )}

          {notification.resourceType && (
            <Descriptions.Item label="Resource Type">
              {notification.resourceType}
            </Descriptions.Item>
          )}

          {notification.resourceId && (
            <Descriptions.Item label="Resource ID">
              {notification.resourceId}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </>
  );
}

export default NotificationDetails;