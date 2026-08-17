import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
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
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import Breadcrumbs from "../../components/Breadcrumbs";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Campaigns() {
  const [search, setSearch] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  // ==================================================
  // FETCH CAMPAIGNS FROM BACKEND
  // ==================================================
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await api.get("/campaigns");
      const data = response?.data?.data || response?.data || [];

      const formatted = Array.isArray(data)
        ? data.map((item) => {
            const dateVal = item.date || item.createdAt;
            const parsedDate = dateVal ? new Date(dateVal) : null;

            return {
              ...item,
              key: item._id || item.id,
              date: parsedDate && !isNaN(parsedDate) ? parsedDate.toLocaleDateString("en-IN") : "-",
            };
          })
        : [];

      setCampaigns(formatted);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      message.error(
        error.response?.data?.message || "Failed to load marketing campaigns"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // ==================================================
  // SUBMIT HANDLER (Create or Update)
  // ==================================================
  const handleSaveCampaign = async (values) => {
    try {
      setSubmitLoading(true);
      if (editingCampaign) {
        // Update
        const id = editingCampaign._id || editingCampaign.key;
        await api.put(`/campaigns/${id}`, values);
        message.success("Campaign updated successfully");
      } else {
        // Create
        await api.post("/campaigns", values);
        message.success("Campaign created successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (error) {
      console.error("Failed to save campaign:", error);
      message.error(
        error.response?.data?.message || "Failed to save campaign"
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // ==================================================
  // DELETE HANDLER
  // ==================================================
  const handleDelete = async (id) => {
    try {
      await api.delete(`/campaigns/${id}`);
      message.success("Campaign deleted successfully");
      setCampaigns((prev) => prev.filter((item) => (item._id || item.key) !== id));
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      message.error(
        error.response?.data?.message || "Failed to delete campaign"
      );
    }
  };

  // ==================================================
  // OPEN MODAL FOR EDIT
  // ==================================================
  const handleEditClick = (record) => {
    setEditingCampaign(record);
    form.setFieldsValue({
      name: record.name,
      type: record.type,
      audience: record.audience,
      status: record.status,
    });
    setIsModalOpen(true);
  };

  // ==================================================
  // OPEN MODAL FOR CREATE
  // ==================================================
  const handleCreateClick = () => {
    setEditingCampaign(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // ==================================================
  // FILTER CAMPAIGNS
  // ==================================================
  const filteredCampaigns = useMemo(() => {
    const value = debouncedSearch.trim().toLowerCase();

    if (!value) {
      return campaigns;
    }

    return campaigns.filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(value) ||
        campaign.type.toLowerCase().includes(value) ||
        campaign.audience.toLowerCase().includes(value)
    );
  }, [campaigns, debouncedSearch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Completed":
        return "blue";
      case "Scheduled":
        return "orange";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Campaign",
      dataIndex: "name",
      key: "name",
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Audience",
      dataIndex: "audience",
      key: "audience",
    },
    {
      title: "Sent",
      dataIndex: "sent",
      key: "sent",
      render: (sent) => (sent ? sent.toLocaleString("en-IN") : 0),
    },
    {
      title: "Open Rate",
      dataIndex: "openRate",
      key: "openRate",
      render: (openRate) => `${openRate || 0}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditClick(record)}
          >
            Edit
          </Button>

          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id || record.key)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Breadcrumbs
        items={[
          { label: "Marketing" },
          { label: "Marketing Campaigns" },
        ]}
      />
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
          <Title level={3} style={{ margin: 0 }}>
            Marketing Campaigns
          </Title>
          <Text type="secondary">
            Manage email newsletters, push notifications, and banner campaigns.
          </Text>
        </div>

        <Space wrap>
          <Input
            allowClear
            placeholder="Search campaigns"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: 230 }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
          >
            Create Campaign
          </Button>
        </Space>
      </div>

      <Table
        rowKey={(record) => record._id || record.key}
        columns={columns}
        dataSource={filteredCampaigns}
        loading={loading}
        pagination={{
          pageSize: 5,
          showSizeChanger: true,
        }}
        scroll={{ x: "max-content" }}
      />

      {/* Create / Edit Campaign Modal */}
      <Modal
        title={editingCampaign ? "Edit Campaign" : "Create Campaign"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitLoading}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveCampaign}
          initialValues={{ status: "Active", type: "Email" }}
        >
          <Form.Item
            name="name"
            label="Campaign Name"
            rules={[{ required: true, message: "Please enter campaign name" }]}
          >
            <Input placeholder="e.g. Summer Sale 2026" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Please select campaign type" }]}
          >
            <Select
              options={[
                { value: "Email", label: "Email" },
                { value: "Push Notification", label: "Push Notification" },
                { value: "Banner", label: "Banner" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="audience"
            label="Audience"
            rules={[{ required: true, message: "Please enter target audience" }]}
          >
            <Input placeholder="e.g. All Customers, New Customers" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select
              options={[
                { value: "Active", label: "Active" },
                { value: "Completed", label: "Completed" },
                { value: "Scheduled", label: "Scheduled" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}

export default Campaigns;