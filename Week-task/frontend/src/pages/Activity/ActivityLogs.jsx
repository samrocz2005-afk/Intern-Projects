import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LoginOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/axios";

const { Title, Text } = Typography;

function ActivityLogs() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const debouncedSearch = useDebounce(search, 500);

  // ----------------------------------------
  // Fetch Activity Logs
  // ----------------------------------------

  const fetchActivityLogs = useCallback(
    async (
      page = 1,
      limit = 10,
      searchQuery = ""
    ) => {
      try {
        setLoading(true);

        const response = await api.get(
          "/activity-logs",
          {
            params: {
              page,
              limit,
              search: searchQuery,
            },
          }
        );

        const logsArray =
          response?.data?.data || [];

        const paginationData =
          response?.data?.pagination || {};

        const formattedLogs =
          Array.isArray(logsArray)
            ? logsArray.map((log) => {
                const user = log?.user;
                let userName = "System";

                if (
                  typeof user === "object" &&
                  user !== null
                ) {
                  const firstName =
                    user.firstName || "";
                  const lastName =
                    user.lastName || "";

                  userName =
                    `${firstName} ${lastName}`.trim() ||
                    user.email ||
                    user._id ||
                    "System";
                } else if (
                  typeof user === "string"
                ) {
                  userName = user;
                }

                return {
                  ...log,
                  activityId: log?._id,
                  key: log?._id || log?.id,
                  user: userName,
                };
              })
            : [];

        setActivities(formattedLogs);

        setPagination((prev) => ({
          ...prev,
          current: page,
          pageSize: limit,
          total:
            paginationData.total ||
            formattedLogs.length,
        }));
      } catch (error) {
        message.error(
          error?.response?.data?.message ||
            "Failed to fetch activity logs"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ----------------------------------------
  // Fetch on search / pagination
  // ----------------------------------------

  const { current, pageSize } = pagination;

  useEffect(() => {
    fetchActivityLogs(
      current,
      pageSize,
      debouncedSearch
    );
  }, [
    current,
    pageSize,
    debouncedSearch,
    fetchActivityLogs,
  ]);

  // ----------------------------------------
  // Table pagination
  // ----------------------------------------

  const handleTableChange = (
    newPagination
  ) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  // ----------------------------------------
  // Type color
  // ----------------------------------------

  const getTypeColor = (type) => {
    switch (type) {
      case "Create":
        return "green";
      case "Update":
        return "blue";
      case "Delete":
        return "red";
      case "Login":
        return "purple";
      case "Settings":
        return "orange";
      default:
        return "default";
    }
  };

  // ----------------------------------------
  // Type icon
  // ----------------------------------------

  const getTypeIcon = (type) => {
    switch (type) {
      case "Create":
        return <PlusOutlined />;
      case "Update":
        return <EditOutlined />;
      case "Delete":
        return <DeleteOutlined />;
      case "Login":
        return <LoginOutlined />;
      case "Settings":
        return <SettingOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  // ----------------------------------------
  // Columns
  // ----------------------------------------

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user, record) => (
        <Space
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (!record.activityId) {
              message.error("Activity log ID is missing");
              return;
            }
            navigate(`/activity-logs/${record.activityId}`);
          }}
        >
          <UserOutlined style={{ color: "#1677ff" }} />
          <Text strong style={{ color: "#1677ff" }}>
            {user || "System"}
          </Text>
        </Space>
      ),
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action) => <Text strong>{action || "N/A"}</Text>,
    },

    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      render: (module) => <Tag>{module || "N/A"}</Tag>,
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => description || "N/A",
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={getTypeColor(type)}
          icon={getTypeIcon(type)}
        >
          {type || "Info"}
        </Tag>
      ),
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date
          ? new Date(date).toLocaleDateString("en-IN")
          : "-",
    },

    {
      title: "Time",
      dataIndex: "createdAt",
      key: "createdAtTime",
      render: (date) =>
        date
          ? new Date(date).toLocaleTimeString("en-IN")
          : "-",
    },
  ];

  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <Card>
      <Breadcrumbs />

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
            Activity Logs
          </Title>
          <Text type="secondary">
            Track administrative actions, security events, and system activities.
          </Text>
        </div>

        <Input
          allowClear
          placeholder="Search activity logs"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{ width: 250 }}
        />
      </div>

      <Table
        rowKey="key"
        columns={columns}
        dataSource={activities}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        scroll={{
          x: "max-content",
        }}
      />
    </Card>
  );
}

export default ActivityLogs;