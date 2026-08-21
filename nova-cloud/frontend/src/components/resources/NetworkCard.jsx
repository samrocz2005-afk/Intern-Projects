import React from "react";
import {
  Card,
  Descriptions,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  GlobalOutlined,
  ApiOutlined,
} from "@ant-design/icons";

import ResourceStatus from "./ResourceStatus";

const { Text } = Typography;

const NetworkCard = ({
  network,
  loading = false,
  onClick,
  onDelete,
}) => {
  if (!network) {
    return null;
  }

  return (
    <Card
      loading={loading}
      hoverable={Boolean(onClick)}
      onClick={onClick}
      title={
        <Space>
          <GlobalOutlined />
          <span>
            {network.name ||
              "Unnamed Network"}
          </span>
        </Space>
      }
      extra={
        <ResourceStatus
          status={network.status}
        />
      }
      actions={
        onDelete
          ? [
              <Text
                type="danger"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(network);
                }}
              >
                Delete
              </Text>,
            ]
          : undefined
      }
    >
      <Descriptions
        column={1}
        size="small"
      >
        <Descriptions.Item label="CIDR">
          <Tag>
            {network.cidr || "N/A"}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Gateway">
          {network.gateway ||
            "N/A"}
        </Descriptions.Item>

        <Descriptions.Item label="Instances">
          <Space>
            <ApiOutlined />
            {network.instances?.length ??
              network.instanceCount ??
              0}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Created">
          {network.createdAt
            ? new Date(
                network.createdAt
              ).toLocaleDateString()
            : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default NetworkCard;