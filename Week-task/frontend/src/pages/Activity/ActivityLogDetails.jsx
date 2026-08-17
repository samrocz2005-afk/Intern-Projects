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
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  LoginOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../../services/axios";
import Breadcrumbs from "../../components/Breadcrumbs";

const { Title, Text } = Typography;

function ActivityLogDetails() {
  const { activityId } = useParams();
  const navigate = useNavigate();

  const [activity, setActivity] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      if (!activityId) {
        message.error(
          "Activity log ID is missing"
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        console.log(
          "Fetching Activity Log:",
          activityId
        );

        const response = await api.get(
          `/activity-logs/${activityId}`
        );

        console.log(
          "Activity Details Response:",
          response?.data
        );

        const responseData =
          response?.data;

        const activityData =
          responseData?.data?.activity ||
          responseData?.data ||
          responseData?.activity ||
          null;

        if (
          !activityData ||
          typeof activityData !== "object"
        ) {
          setActivity(null);

          message.error(
            "Activity log not found"
          );

          return;
        }

        setActivity(activityData);
      } catch (error) {
        console.error(
          "Fetch Activity Details Error:",
          error
        );

        console.error(
          "Backend Error:",
          error?.response?.data
        );

        message.error(
          error?.response?.data?.message ||
            "Failed to fetch activity details"
        );

        setActivity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [activityId]);

  // ----------------------------------------
  // Loading
  // ----------------------------------------

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

  // ----------------------------------------
  // Not found
  // ----------------------------------------

  if (!activity) {
    return (
      <div>
        <Breadcrumbs />

        <Card>
          <Title level={4}>
            Activity log not found
          </Title>

          <Text type="secondary">
            Unable to find activity log with ID:{" "}
            {activityId}
          </Text>

          <div style={{ marginTop: 20 }}>
            <Button
              type="primary"
              icon={
                <ArrowLeftOutlined />
              }
              onClick={() =>
                navigate("/activity-logs")
              }
            >
              Back to Activity Logs
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ----------------------------------------
  // Type
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
  // User
  // ----------------------------------------

  const user = activity.user;

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

  // ----------------------------------------
  // Date / Time
  // ----------------------------------------

  const createdAt =
    activity.createdAt
      ? new Date(activity.createdAt)
      : null;

  const date = createdAt
    ? createdAt.toLocaleDateString("en-IN")
    : "N/A";

  const time = createdAt
    ? createdAt.toLocaleTimeString("en-IN")
    : "N/A";

  // ----------------------------------------
  // UI
  // ----------------------------------------

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
            Activity Log Details
          </Title>

          <Text type="secondary">
            View detailed activity information.
          </Text>
        </div>

        <Button
          icon={
            <ArrowLeftOutlined />
          }
          onClick={() =>
            navigate("/activity-logs")
          }
        >
          Back to Activity Logs
        </Button>
      </div>

      <Card>
        <Descriptions
          title="Activity Information"
          bordered
          column={{
            xs: 1,
            sm: 1,
            md: 2,
            lg: 2,
          }}
        >
          <Descriptions.Item label="Activity ID">
            <Text strong>
              {activity._id ||
                activityId}
            </Text>
          </Descriptions.Item>

          <Descriptions.Item label="User">
            {userName}
          </Descriptions.Item>

          <Descriptions.Item label="Action">
            {activity.action || "N/A"}
          </Descriptions.Item>

          <Descriptions.Item label="Module">
            <Tag>
              {activity.module ||
                "N/A"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Type">
            <Tag
              color={getTypeColor(
                activity.type
              )}
              icon={getTypeIcon(
                activity.type
              )}
            >
              {activity.type ||
                "Info"}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Date">
            {date}
          </Descriptions.Item>

          <Descriptions.Item label="Time">
            {time}
          </Descriptions.Item>

          <Descriptions.Item
            label="Description"
            span={2}
          >
            {activity.description ||
              "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}

export default ActivityLogDetails;