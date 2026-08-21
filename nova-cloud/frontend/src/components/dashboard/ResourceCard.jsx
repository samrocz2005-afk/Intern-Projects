import React from "react";

import {
  Card,
  Statistic,
  Typography,
} from "antd";

const { Text } = Typography;

const ResourceCard = ({
  title,
  value = 0,
  icon,
  suffix,
  loading = false,
  description,
  onClick,
}) => {
  return (
    <Card
      hoverable={Boolean(onClick)}
      onClick={onClick}
      style={{
        height: "100%",
        cursor: onClick
          ? "pointer"
          : "default",
      }}
    >
      <Statistic
        title={title}
        value={value}
        suffix={suffix}
        prefix={icon}
        loading={loading}
      />

      {description && (
        <Text
          type="secondary"
          style={{
            display: "block",
            marginTop: 8,
          }}
        >
          {description}
        </Text>
      )}
    </Card>
  );
};

export default ResourceCard;