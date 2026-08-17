import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

import {
  BellOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import useDebounce from "../../hooks/useDebounce";
import api from "../../services/axios";
import Breadcrumbs from "../../components/Breadcrumbs";

const { Title, Text } = Typography;

function Notifications() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==================================================
  // AUTH USER
  // ==================================================

  const [currentUser, setCurrentUser] = useState(null);

  // ==================================================
  // CREATE NOTIFICATION STATE
  // ==================================================

  const [createModalOpen, setCreateModalOpen] =
    useState(false);

  const [customers, setCustomers] = useState([]);

  const [customersLoading, setCustomersLoading] =
    useState(false);

  const [createLoading, setCreateLoading] =
    useState(false);

  const [notificationForm, setNotificationForm] =
    useState({
      recipient: "",
      title: "",
      message: "",
      type: "Info",
    });

  const debouncedSearch = useDebounce(search, 500);

  // ==================================================
  // GET LOGGED-IN USER
  // ==================================================

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        setCurrentUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      /*
       * Supports:
       *
       * localStorage user = { role: "admin" }
       *
       * OR
       *
       * localStorage user = { user: { role: "admin" } }
       *
       * OR
       *
       * localStorage user = { data: { user: { role: "admin" } } }
       */

      const user =
        parsedUser?.user ||
        parsedUser?.data?.user ||
        parsedUser;

      setCurrentUser(user);
    } catch (error) {
      console.error(
        "Failed to read logged-in user:",
        error
      );

      setCurrentUser(null);
    }
  }, []);

  // ==================================================
  // ADMIN CHECK
  // ==================================================

  const isAdmin =
    currentUser?.role?.toString().toLowerCase() ===
    "admin";

  // ==================================================
  // FETCH NOTIFICATIONS
  // ==================================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/notifications"
      );

      const data =
        response?.data?.data ||
        response?.data ||
        [];

      const formatted = Array.isArray(data)
        ? data.map((item) => {
            const createdAt = item.createdAt
              ? new Date(item.createdAt)
              : null;

            return {
              ...item,

              key: item._id,

              status: item.isRead
                ? "Read"
                : "Unread",

              date: createdAt
                ? createdAt.toLocaleDateString()
                : "-",

              time: createdAt
                ? createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-",
            };
          })
        : [];

      setNotifications(formatted);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error
      );

      /*
       * Environment Admin uses "env-admin-id"
       * which is not a MongoDB ObjectId.
       *
       * Therefore an empty notification list
       * is acceptable for Admin.
       */
      if (
        error.response?.data?.error !==
        "INVALID_ID"
      ) {
        message.error(
          error.response?.data?.message ||
            "Failed to load notifications"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // FETCH CUSTOMERS
  // ==================================================

  const fetchCustomers = async () => {
    /*
     * Extra frontend protection.
     *
     * Customers should never load this list
     * because they cannot create notifications.
     */
    if (!isAdmin) {
      return;
    }

    try {
      setCustomersLoading(true);

      const response = await api.get(
        "/customers"
      );

      if (response.data?.success) {
        setCustomers(
          response.data.data || []
        );
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch customers:",
        error
      );

      message.error(
        error.response?.data?.message ||
          "Failed to load customers"
      );
    } finally {
      setCustomersLoading(false);
    }
  };

  // ==================================================
  // INITIAL FETCH
  // ==================================================

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ==================================================
  // OPEN CREATE MODAL
  // ==================================================

  const openCreateModal = () => {
    /*
     * NEVER allow non-admin to open modal.
     */
    if (!isAdmin) {
      message.error(
        "Only Admin can create notifications"
      );
      return;
    }

    setNotificationForm({
      recipient: "",
      title: "",
      message: "",
      type: "Info",
    });

    setCreateModalOpen(true);

    if (customers.length === 0) {
      fetchCustomers();
    }
  };

  // ==================================================
  // CLOSE CREATE MODAL
  // ==================================================

  const closeCreateModal = () => {
    if (createLoading) {
      return;
    }

    setCreateModalOpen(false);

    setNotificationForm({
      recipient: "",
      title: "",
      message: "",
      type: "Info",
    });
  };

  // ==================================================
  // CREATE NOTIFICATION
  // ==================================================

  const handleCreateNotification = async () => {
    /*
     * Extra security check on frontend.
     */
    if (!isAdmin) {
      message.error(
        "Only Admin can create notifications"
      );
      return;
    }

    const {
      recipient,
      title,
      message: notificationMessage,
      type,
    } = notificationForm;

    if (!recipient) {
      message.error(
        "Please select a customer"
      );
      return;
    }

    if (!title.trim()) {
      message.error(
        "Notification title is required"
      );
      return;
    }

    if (!notificationMessage.trim()) {
      message.error(
        "Notification message is required"
      );
      return;
    }

    try {
      setCreateLoading(true);

      const response = await api.post(
        "/notifications",
        {
          recipient,
          recipientModel: "Customer",
          title: title.trim(),
          message: notificationMessage.trim(),
          type,
          resourceId: null,
          resourceType: "",
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to create notification"
        );
      }

      message.success(
        "Notification sent successfully"
      );

      setCreateModalOpen(false);

      setNotificationForm({
        recipient: "",
        title: "",
        message: "",
        type: "Info",
      });

      /*
       * Admin's own notification list may remain
       * empty because the notification belongs
       * to the Customer.
       */
      await fetchNotifications();
    } catch (error) {
      console.error(
        "Failed to create notification:",
        error
      );

      message.error(
        error.response?.data?.message ||
          "Failed to create notification"
      );
    } finally {
      setCreateLoading(false);
    }
  };

  // ==================================================
  // MARK SINGLE AS READ
  // ==================================================

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(
        `/notifications/${id}/read`
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item.key === id
            ? {
                ...item,
                status: "Read",
                isRead: true,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        "Error marking notification read:",
        error
      );

      message.error(
        error.response?.data?.message ||
          "Failed to update notification"
      );
    }
  };

  // ==================================================
  // MARK ALL AS READ
  // ==================================================

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch(
        "/notifications/read-all"
      );

      message.success(
        "All notifications marked as read"
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          status: "Read",
          isRead: true,
        }))
      );
    } catch (error) {
      console.error(
        "Error marking all read:",
        error
      );

      message.error(
        error.response?.data?.message ||
          "Failed to update notifications"
      );
    }
  };

  // ==================================================
  // DELETE NOTIFICATION
  // ==================================================

  const handleDelete = async (id) => {
    try {
      await api.delete(
        `/notifications/${id}`
      );

      message.success(
        "Notification deleted"
      );

      setNotifications((prev) =>
        prev.filter(
          (item) => item.key !== id
        )
      );
    } catch (error) {
      console.error(
        "Error deleting notification:",
        error
      );

      message.error(
        error.response?.data?.message ||
          "Failed to delete notification"
      );
    }
  };

  // ==================================================
  // HANDLE NOTIFICATION CLICK
  // ==================================================

  const handleNotificationClick = async (record) => {
    if (record.status === "Unread") {
      await handleMarkAsRead(record.key);
    }
    navigate(`/notifications/${record.key}`);
  };

  // ==================================================
  // SEARCH
  // ==================================================

  const filteredNotifications = useMemo(() => {
    const value = debouncedSearch
      .trim()
      .toLowerCase();

    if (!value) {
      return notifications;
    }

    return notifications.filter(
      (notification) =>
        notification.title
          ?.toLowerCase()
          .includes(value) ||
        notification.message
          ?.toLowerCase()
          .includes(value) ||
        notification.type
          ?.toLowerCase()
          .includes(value)
    );
  }, [
    notifications,
    debouncedSearch,
  ]);

  // ==================================================
  // UNREAD COUNT
  // ==================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.status === "Unread"
    ).length;

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
  // CUSTOMER OPTIONS
  // ==================================================

  const customerOptions = customers.map(
    (customer) => {
      const name =
        `${customer.firstName || ""} ${
          customer.lastName || ""
        }`.trim();

      return {
        value: customer._id,

        label: (
          <Space>
            <Avatar
              size="small"
              icon={<UserOutlined />}
            />

            <span>
              {name || "N/A"}
              {" - "}
              {customer.email || "No email"}
            </span>
          </Space>
        ),
      };
    }
  );

  // ==================================================
  // TABLE COLUMNS
  // ==================================================

  const columns = [
    {
      title: "Notification",
      key: "notification",

      render: (_, record) => (
        <Space align="start">
          {getTypeIcon(record.type)}

          <div>
            <Text
              strong={
                record.status === "Unread"
              }
              style={{ cursor: "pointer", color: "#1890ff" }}
              onClick={() => handleNotificationClick(record)}
            >
              {record.title}
            </Text>

            <br />

            <Text type="secondary">
              {record.message}
            </Text>
          </div>
        </Space>
      ),
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",

      render: (type) => (
        <Tag color={getTypeColor(type)}>
          {type}
        </Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => (
        <Badge
          status={
            status === "Unread"
              ? "processing"
              : "default"
          }
          text={status}
        />
      ),
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },

    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },

    {
      title: "Action",
      key: "action",

      render: (_, record) => (
        <Space>
          {record.status === "Unread" && (
            <Button
              type="text"
              icon={
                <CheckCircleOutlined />
              }
              onClick={() =>
                handleMarkAsRead(
                  record.key
                )
              }
            >
              Mark Read
            </Button>
          )}

          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            onClick={() =>
              handleDelete(record.key)
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // ==================================================
  // UI
  // ==================================================

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
          <div>
            <Space align="center">
              <Title
                level={3}
                style={{ margin: 0 }}
              >
                Notifications
              </Title>

              <Badge
                count={unreadCount}
                overflowCount={99}
              />
            </Space>

            <Text type="secondary">
              {isAdmin
                ? "Create and manage customer notifications."
                : "View your notifications and updates."}
            </Text>
          </div>

          <Space wrap>
            <Input
              allowClear
              placeholder="Search notifications"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              style={{ width: 240 }}
            />

            <Button
              icon={
                <CheckCircleOutlined />
              }
              onClick={
                handleMarkAllAsRead
              }
            >
              Mark All Read
            </Button>

            {/* ========================================
                ADMIN ONLY
                ======================================== */}

            {isAdmin && (
              <Button
                type="primary"
                icon={<BellOutlined />}
                onClick={openCreateModal}
              >
                Create Notification
              </Button>
            )}
          </Space>
        </div>

        <Table
          rowKey={(record) =>
            record._id || record.key
          }
          columns={columns}
          dataSource={filteredNotifications}
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

      {/* ==================================================
          CREATE NOTIFICATION MODAL
          ADMIN ONLY
      ================================================== */}

      {isAdmin && (
        <Modal
          title={
            <Space>
              <BellOutlined />

              <span>
                Create Notification
              </span>
            </Space>
          }
          open={createModalOpen}
          onCancel={closeCreateModal}
          onOk={handleCreateNotification}
          confirmLoading={createLoading}
          okText="Send Notification"
          cancelText="Cancel"
          destroyOnHidden
        >
          <Space
            direction="vertical"
            size="middle"
            style={{
              width: "100%",
            }}
          >
            {/* Customer */}

            <div>
              <Text strong>
                Customer
              </Text>

              <Select
                showSearch
                allowClear
                loading={customersLoading}
                placeholder="Select customer"
                style={{
                  width: "100%",
                  marginTop: 6,
                }}
                value={
                  notificationForm.recipient ||
                  undefined
                }
                onChange={(value) =>
                  setNotificationForm(
                    (prev) => ({
                      ...prev,
                      recipient:
                        value || "",
                    })
                  )
                }
                optionFilterProp="label"
                options={customerOptions}
              />
            </div>

            {/* Title */}

            <div>
              <Text strong>
                Title
              </Text>

              <Input
                style={{
                  marginTop: 6,
                }}
                placeholder="Enter notification title"
                value={
                  notificationForm.title
                }
                onChange={(event) =>
                  setNotificationForm(
                    (prev) => ({
                      ...prev,
                      title:
                        event.target.value,
                    })
                  )
                }
                maxLength={200}
                showCount
              />
            </div>

            {/* Message */}

            <div>
              <Text strong>
                Message
              </Text>

              <Input.TextArea
                style={{
                  marginTop: 6,
                }}
                placeholder="Enter notification message"
                value={
                  notificationForm.message
                }
                onChange={(event) =>
                  setNotificationForm(
                    (prev) => ({
                      ...prev,
                      message:
                        event.target.value,
                    })
                  )
                }
                rows={4}
                maxLength={1000}
                showCount
              />
            </div>

            {/* Type */}

            <div>
              <Text strong>
                Type
              </Text>

              <Select
                style={{
                  width: "100%",
                  marginTop: 6,
                }}
                value={
                  notificationForm.type
                }
                onChange={(value) =>
                  setNotificationForm(
                    (prev) => ({
                      ...prev,
                      type: value,
                    })
                  )
                }
                options={[
                  {
                    label: "Info",
                    value: "Info",
                  },
                  {
                    label: "Success",
                    value: "Success",
                  },
                  {
                    label: "Warning",
                    value: "Warning",
                  },
                  {
                    label: "Error",
                    value: "Error",
                  },
                  {
                    label: "Order",
                    value: "Order",
                  },
                  {
                    label: "Inventory",
                    value: "Inventory",
                  },
                  {
                    label: "Payment",
                    value: "Payment",
                  },
                  {
                    label: "System",
                    value: "System",
                  },
                ]}
              />
            </div>
          </Space>
        </Modal>
      )}
    </>
  );
}

export default Notifications;