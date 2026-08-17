import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import useDebounce from "../../hooks/useDebounce";
import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;

function HelpSupport() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State for Server-Side
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  // ==================================================
  // FETCH TICKETS FROM BACKEND (Server-side Pagination)
  // ==================================================
  const fetchTickets = async (page = 1, limit = 5, searchKeyword = "") => {
    try {
      setLoading(true);
      const response = await api.get("/support", {
        params: {
          page,
          limit,
          search: searchKeyword,
        },
      });

      const resData = response?.data;
      const rawItems = resData?.data || resData?.tickets || [];
      const paginationData = resData?.pagination || {};

      const formatted = Array.isArray(rawItems)
        ? rawItems.map((item, index) => ({
            ...item,
            key: item.key || item._id || `${page}-${index}`,
            ticketId: item.ticketId || item.key || item._id,
            customer: item.customer?.name || item.customer || "Unknown Customer",
            subject: item.subject || "No Subject",
            category: item.category || "General",
            priority: item.priority || "Medium",
            status: item.status || "Open",
            date: item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : "-"),
          }))
        : [];

      setTickets(formatted);
      setPagination({
        current: paginationData.page || page,
        pageSize: paginationData.limit || limit,
        total: paginationData.total || formatted.length,
      });
    } catch (error) {
      console.error("Failed to load tickets:", error);
      message.error(
        error.response?.data?.message || "Failed to load support tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page size or debouncedSearch changes
  useEffect(() => {
    fetchTickets(1, pagination.pageSize, debouncedSearch);
  }, [debouncedSearch]);

  // Handle Ant Design Table Pagination Change
  const handleTableChange = (newPagination) => {
    fetchTickets(
      newPagination.current,
      newPagination.pageSize,
      debouncedSearch
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "red";
      case "In Progress":
        return "orange";
      case "Resolved":
        return "green";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
        return "blue";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Ticket",
      dataIndex: "ticketId",
      key: "ticketId",
      render: (ticketId) => <Text strong>{ticketId}</Text>,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (subject) => (
        <Space>
          <MessageOutlined />
          <Text ellipsis={{ tooltip: subject }}>{subject}</Text>
        </Space>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={getStatusColor(status)}
          icon={
            status === "Open" ? (
              <ClockCircleOutlined />
            ) : status === "Resolved" ? (
              <CheckCircleOutlined />
            ) : null
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <>
      {/* Integrated Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Administration" },
          { label: "Help & Support" },
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
            <Title level={3} style={{ margin: 0 }}>
              Help & Support
            </Title>
            <Text type="secondary">
              Manage customer support tickets, live chat, and frequently asked questions.
            </Text>
          </div>

          <Space wrap>
            <Input
              allowClear
              placeholder="Search tickets"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{ width: 230 }}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={tickets}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </>
  );
}

export default HelpSupport;