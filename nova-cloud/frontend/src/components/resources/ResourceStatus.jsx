import React from "react";
import { Tag } from "antd";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  PauseCircleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const STATUS_CONFIG = {
  running: {
    color: "success",
    icon: (
      <CheckCircleOutlined />
    ),
    label: "Running",
  },

  active: {
    color: "success",
    icon: (
      <CheckCircleOutlined />
    ),
    label: "Active",
  },

  available: {
    color: "success",
    icon: (
      <CheckCircleOutlined />
    ),
    label: "Available",
  },

  stopped: {
    color: "default",
    icon: (
      <PauseCircleOutlined />
    ),
    label: "Stopped",
  },

  inactive: {
    color: "default",
    icon: (
      <PauseCircleOutlined />
    ),
    label: "Inactive",
  },

  creating: {
    color: "processing",
    icon: <LoadingOutlined />,
    label: "Creating",
  },

  starting: {
    color: "processing",
    icon: <LoadingOutlined />,
    label: "Starting",
  },

  stopping: {
    color: "processing",
    icon: <LoadingOutlined />,
    label: "Stopping",
  },

  deleting: {
    color: "processing",
    icon: <LoadingOutlined />,
    label: "Deleting",
  },

  pending: {
    color: "processing",
    icon: <SyncOutlined spin />,
    label: "Pending",
  },

  error: {
    color: "error",
    icon: (
      <CloseCircleOutlined />
    ),
    label: "Error",
  },

  failed: {
    color: "error",
    icon: (
      <CloseCircleOutlined />
    ),
    label: "Failed",
  },

  unhealthy: {
    color: "error",
    icon: (
      <ExclamationCircleOutlined />
    ),
    label: "Unhealthy",
  },
};

const ResourceStatus = ({
  status,
}) => {
  const normalizedStatus =
    String(status || "unknown")
      .toLowerCase();

  const config =
    STATUS_CONFIG[
      normalizedStatus
    ];

  if (!config) {
    return (
      <Tag color="default">
        {status || "Unknown"}
      </Tag>
    );
  }

  return (
    <Tag
      color={config.color}
      icon={config.icon}
    >
      {config.label}
    </Tag>
  );
};

export default ResourceStatus;