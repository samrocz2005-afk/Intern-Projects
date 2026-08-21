import React from "react";
import {
  Card,
  Descriptions,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  CloudServerOutlined,
  EnvironmentOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

import ResourceStatus from "./ResourceStatus";

const { Text } = Typography;

const InstanceCard = ({
  instance,
  loading = false,
  onClick,
  onDelete,
}) => {
  if (!instance) {
    return null;
  }

  const flavor =
    instance.flavor?.name ||
    instance.flavorName ||
    "N/A";

  const network =
    instance.network?.name ||
    instance.networkName ||
    "N/A";

  return (
    <Card
      loading={loading}
      hoverable={Boolean(onClick)}
      onClick={onClick}
      title={
        <Space>
          <CloudServerOutlined />
          <span>
            {instance.name ||
              "Unnamed Instance"}
          </span>
        </Space>
      }
      extra={
        <ResourceStatus
          status={instance.status}
        />
      }
      actions={
        onDelete
          ? [
              <Text
                type="danger"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(instance);
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
        <Descriptions.Item label="Flavor">
          <Tag
            icon={
              <DatabaseOutlined />
            }
          >
            {flavor}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Network">
          <Space>
            <EnvironmentOutlined />
            {network}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="IP Address">
          {instance.ipAddress ||
            instance.privateIp ||
            instance.publicIp ||
            "Not assigned"}
        </Descriptions.Item>

        <Descriptions.Item label="Created">
          {instance.createdAt
            ? new Date(
                instance.createdAt
              ).toLocaleDateString()
            : "N/A"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default InstanceCard;