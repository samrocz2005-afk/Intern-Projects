import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
  Spin,
  Drawer,
  Form,
  Select,
  Checkbox,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SafetyOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

import useDebounce from "../../hooks/useDebounce";
import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;
const { Option } = Select;

const AVAILABLE_PERMISSIONS = [
  "Manage Orders",
  "Manage Products",
  "Manage Customers",
  "Manage Staff",
  "View Analytics",
  "System Settings",
];

function StaffPermissions() {
  const [search, setSearch] = useState("");
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);

  // Drawer / Modal state for adding/editing staff permissions
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  // Fetch staff
  const fetchStaff = async () => {
    try {
      setLoading(true);

      const response = await api.get("/staff", {
        params: {
          search: debouncedSearch.trim(),
        },
      });

      if (response.data?.success) {
        setStaff(response.data.data || []);
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to fetch staff"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [debouncedSearch]);

  // Filter staff on frontend as well
  const filteredStaff = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (!value) {
      return staff;
    }

    return staff.filter((member) => {
      const fullName =
        `${member.firstName || ""} ${
          member.lastName || ""
        }`.trim();

      return (
        fullName.toLowerCase().includes(value) ||
        member.email?.toLowerCase().includes(value) ||
        member.role?.toLowerCase().includes(value)
      );
    });
  }, [staff, debouncedSearch]);

  // Role colors
  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "red";

      case "Manager":
        return "blue";

      case "Staff":
        return "orange";

      case "Support":
        return "green";

      default:
        return "default";
    }
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";

      case "Inactive":
        return "red";

      case "Suspended":
        return "orange";

      default:
        return "default";
    }
  };

  // Handle open drawer for Add or Edit
  const handleOpenDrawer = (record = null) => {
    setEditingStaff(record);
    if (record) {
      form.setFieldsValue({
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        role: record.role,
        status: record.status || "Active",
        permissions: record.permissions || [],
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        role: "Staff",
        status: "Active",
        permissions: [],
      });
    }
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setEditingStaff(null);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      if (editingStaff) {
        // Update staff permissions/details
        const response = await api.put(
          `/staff/${editingStaff._id || editingStaff.key}`,
          values
        );
        if (response.data?.success) {
          message.success("Staff updated successfully");
          fetchStaff();
          handleCloseDrawer();
        }
      } else {
        // Create new staff
        const response = await api.post("/staff", values);
        if (response.data?.success) {
          message.success("Staff added successfully");
          fetchStaff();
          handleCloseDrawer();
        }
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to save staff details"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Staff Member",
      key: "staff",
      render: (_, record) => {
        const fullName =
          `${record.firstName || ""} ${
            record.lastName || ""
          }`.trim();

        return (
          <Space>
            <Avatar icon={<UserOutlined />} />

            <div>
              <Text strong>
                {fullName || "N/A"}
              </Text>

              <br />

              <Text type="secondary">
                {record.email || "N/A"}
              </Text>
            </div>
          </Space>
        );
      },
    },

    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag
          color={getRoleColor(role)}
          icon={<SafetyOutlined />}
        >
          {role}
        </Tag>
      ),
    },

    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions) => {
        if (!permissions || permissions.length === 0) {
          return (
            <Text type="secondary">
              No permissions
            </Text>
          );
        }

        return permissions.map((permission) => (
          <Tag key={permission}>
            {permission}
          </Tag>
        ));
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => handleOpenDrawer(record)}
        >
          Edit Permissions
        </Button>
      ),
    },
  ];

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: "Administration",
          },
          {
            label: "Staff & Permissions",
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
          <div>
            <Title
              level={3}
              style={{ margin: 0 }}
            >
              Staff & Permissions
            </Title>

            <Text type="secondary">
              Manage staff accounts, roles, and access
              permissions.
            </Text>
          </div>

          <Space wrap>
            <Input
              allowClear
              placeholder="Search staff"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              style={{ width: 220 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpenDrawer()}
            >
              Add Staff
            </Button>
          </Space>
        </div>

        <Table
          rowKey={(record) => record._id || record.key}
          columns={columns}
          dataSource={filteredStaff}
          loading={{
            spinning: loading,
            indicator: <Spin />,
          }}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Drawer for Adding / Editing Staff & Permissions */}
      <Drawer
        title={
          editingStaff
            ? "Edit Staff Permissions"
            : "Add Staff Member"
        }
        width={420}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        extra={
          <Space>
            <Button onClick={handleCloseDrawer}>
              Cancel
            </Button>
            <Button
              onClick={() => form.submit()}
              type="primary"
              loading={submitting}
            >
              {editingStaff ? "Update" : "Save"}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              {
                required: true,
                message: "Please enter first name",
              },
            ]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              {
                required: true,
                message: "Please enter last name",
              },
            ]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email",
              },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[
              {
                required: true,
                message: "Please select a role",
              },
            ]}
          >
            <Select placeholder="Select role">
              <Option value="Admin">Admin</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Staff">Staff</Option>
              <Option value="Support">Support</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[
              {
                required: true,
                message: "Please select status",
              },
            ]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
              <Option value="Suspended">Suspended</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Access Permissions"
          >
            <Checkbox.Group
              options={AVAILABLE_PERMISSIONS}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
}

export default StaffPermissions;