import React from "react";
import {
  Card,
  Descriptions,
  Progress,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  HddOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";

import ResourceStatus from "./ResourceStatus";

const { Text } = Typography;

const StorageCard = ({
  storage,
  loading = false,
  onClick,
  onDelete,
}) => {
  if (!storage) {
    return null;
  }

  const capacity =
    Number(
      storage.size ??
        storage.capacity ??
        0
    );

  const used =
    Number(storage.used ?? 0);

  const usage =
    capacity > 0
      ? Math.min(
          Math.round(
            (used / capacity) * 100
          ),
          100
        )
      : 0;

  const attachedInstance =
    storage.instance?.name ||
    storage.instanceName ||
    null;

  return (
    <Card
      loading={loading}
      hoverable={Boolean(onClick)}
      onClick={onClick}
      title={
        <Space>
          <HddOutlined />
          <span>
            {storage.name ||
              "Unnamed Storage"}
          </span>
        </Space>
      }
      extra={
        <ResourceStatus
          status={storage.status}
        />
      }
      actions={
        onDelete
          ? [
              <Text
                type="danger"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(storage);
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
        <Descriptions.Item label="Type">
          <Tag>
            {storage.type ||
              "Volume"}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Capacity">
          {capacity}{" "}
          {storage.unit || "GB"}
        </Descriptions.Item>

        <Descriptions.Item label="Usage">
          <Progress
            percent={usage}
            size="small"
          />
        </Descriptions.Item>

        <Descriptions.Item label="Attached To">
          <Space>
            {attachedInstance && (
              <CloudServerOutlined />
            )}

            {attachedInstance ||
              "Not attached"}
          </Space>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default StorageCard;