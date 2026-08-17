import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
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
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import useDebounce from "../../hooks/useDebounce";
import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Customers() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Notification modal
  const [notifyModalOpen, setNotifyModalOpen] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [notifyLoading, setNotifyLoading] =
    useState(false);

  // Notification form
  const [notificationForm, setNotificationForm] =
    useState({
      title: "",
      message: "",
      type: "Info",
    });

  const debouncedSearch = useDebounce(search, 500);

  // --------------------------------------------------
  // Fetch customers
  // --------------------------------------------------

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          "/customers"
        );

        if (response.data?.success) {
          setCustomers(
            response.data.data || []
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch customers:",
          error
        );

        message.error(
          error.response?.data?.message ||
            "Failed to fetch customers"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const filteredCustomers = useMemo(() => {
    const value = debouncedSearch
      .trim()
      .toLowerCase();

    if (!value) {
      return customers;
    }

    return customers.filter((customer) => {
      const name =
        `${customer.firstName || ""} ${
          customer.lastName || ""
        }`.toLowerCase();

      const email =
        customer.email?.toLowerCase() || "";

      const phone =
        customer.phone?.toLowerCase() || "";

      return (
        name.includes(value) ||
        email.includes(value) ||
        phone.includes(value)
      );
    });
  }, [customers, debouncedSearch]);

  // --------------------------------------------------
  // Open notification modal
  // --------------------------------------------------

  const openNotifyModal = (customer) => {
    setSelectedCustomer(customer);

    setNotificationForm({
      title: "",
      message: "",
      type: "Info",
    });

    setNotifyModalOpen(true);
  };

  // --------------------------------------------------
  // Close notification modal
  // --------------------------------------------------

  const closeNotifyModal = () => {
    if (notifyLoading) {
      return;
    }

    setNotifyModalOpen(false);
    setSelectedCustomer(null);

    setNotificationForm({
      title: "",
      message: "",
      type: "Info",
    });
  };

  // --------------------------------------------------
  // Send notification
  // --------------------------------------------------

  const handleSendNotification = async () => {
    const title =
      notificationForm.title.trim();

    const notificationMessage =
      notificationForm.message.trim();

    // Validate title
    if (!title) {
      message.error(
        "Notification title is required"
      );
      return;
    }

    // Validate message
    if (!notificationMessage) {
      message.error(
        "Notification message is required"
      );
      return;
    }

    // Validate customer
    if (!selectedCustomer?._id) {
      message.error(
        "Customer not selected"
      );
      return;
    }

    try {
      setNotifyLoading(true);

      // --------------------------------------------
      // Admin -> Customer notification
      // --------------------------------------------

      const response = await api.post(
        "/notifications",
        {
          recipient:
            selectedCustomer._id,

          recipientModel:
            "Customer",

          title,

          message:
            notificationMessage,

          type:
            notificationForm.type,

          resourceId:
            selectedCustomer._id,

          resourceType:
            "Customer",
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Failed to send notification"
        );
      }

      const customerName =
        `${selectedCustomer.firstName || ""} ${
          selectedCustomer.lastName || ""
        }`.trim() || "customer";

      message.success(
        `Notification sent to ${customerName}`
      );

      // Close modal
      setNotifyModalOpen(false);
      setSelectedCustomer(null);

      // Reset form
      setNotificationForm({
        title: "",
        message: "",
        type: "Info",
      });
    } catch (error) {
      console.error(
        "Failed to send notification:",
        error
      );

      message.error(
        error.response?.data?.message ||
          "Failed to send notification"
      );
    } finally {
      setNotifyLoading(false);
    }
  };

  // --------------------------------------------------
  // Table columns
  // --------------------------------------------------

  const columns = [
    {
      title: "Customer",
      key: "customer",

      render: (_, record) => {
        const fullName =
          `${record.firstName || ""} ${
            record.lastName || ""
          }`.trim();

        return (
          <Button
            type="link"
            style={{
              padding: 0,
              height: "auto",
              textAlign: "left",
            }}
            onClick={(event) => {
              event.stopPropagation();

              navigate(
                `/customers/${record._id}`
              );
            }}
          >
            <Space>
              <Avatar
                icon={<UserOutlined />}
              />

              <div>
                <div
                  style={{
                    fontWeight: 500,
                  }}
                >
                  {fullName || "N/A"}
                </div>

                <Text type="secondary">
                  {record.email || "N/A"}
                </Text>
              </div>
            </Space>
          </Button>
        );
      },
    },

    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",

      render: (phone) =>
        phone || "N/A",
    },

    {
      title: "Orders",
      dataIndex: "orders",
      key: "orders",

      render: (orders) =>
        orders ?? 0,
    },

    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      key: "totalSpent",

      render: (totalSpent) =>
        `₹${Number(
          totalSpent || 0
        ).toLocaleString("en-IN")}`,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => (
        <Tag
          color={
            status === "Active"
              ? "green"
              : "red"
          }
        >
          {status || "Inactive"}
        </Tag>
      ),
    },

    // --------------------------------------------------
    // Notify action
    // --------------------------------------------------

    {
      title: "Action",
      key: "action",

      render: (_, record) => (
        <Button
          type="text"
          icon={<BellOutlined />}
          onClick={(event) => {
            event.stopPropagation();

            openNotifyModal(record);
          }}
        >
          Notify
        </Button>
      ),
    },
  ];

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: "Customers",
          },
          {
            label: "All Customers",
          },
        ]}
      />

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
            style={{
              margin: 0,
            }}
          >
            Customers
          </Title>

          <Input
            allowClear
            placeholder="Search customers"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              width: 280,
            }}
          />
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={filteredCustomers}
          loading={loading}
          onRow={(record) => ({
            onClick: () => {
              navigate(
                `/customers/${record._id}`
              );
            },

            style: {
              cursor: "pointer",
            },
          })}
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
          SEND NOTIFICATION MODAL
      ================================================== */}

      <Modal
        title={
          <Space>
            <BellOutlined />

            <span>
              Send Notification
            </span>
          </Space>
        }
        open={notifyModalOpen}
        onCancel={closeNotifyModal}
        onOk={handleSendNotification}
        confirmLoading={notifyLoading}
        okText="Send Notification"
        cancelText="Cancel"
        destroyOnHidden
      >
        {/* Selected customer */}

        {selectedCustomer && (
          <div
            style={{
              marginBottom: 24,
              padding: "12px 16px",
              background: "#fafafa",
              borderRadius: 8,
            }}
          >
            <Text type="secondary">
              Send notification to
            </Text>

            <div
              style={{
                marginTop: 6,
              }}
            >
              <Space>
                <Avatar
                  icon={<UserOutlined />}
                  size="small"
                />

                <Text strong>
                  {`${selectedCustomer.firstName || ""} ${
                    selectedCustomer.lastName || ""
                  }`.trim() || "N/A"}
                </Text>
              </Space>
            </div>

            <Text type="secondary">
              {selectedCustomer.email ||
                "N/A"}
            </Text>
          </div>
        )}

        <Space
          direction="vertical"
          size="middle"
          style={{
            width: "100%",
          }}
        >
          {/* Notification title */}

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

          {/* Notification message */}

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

          {/* Notification type */}

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
    </>
  );
}

export default Customers;