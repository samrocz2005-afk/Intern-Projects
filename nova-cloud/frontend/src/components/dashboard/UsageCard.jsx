import React from "react";

import {
  Card,
  Progress,
  Statistic,
  Typography,
} from "antd";

const { Text } = Typography;

const UsageCard = ({
  title,
  used = 0,
  total = 0,
  unit = "",
  loading = false,
  description,
}) => {
  const percentage =
    total > 0
      ? Math.min(
          Math.round(
            (used / total) * 100
          ),
          100
        )
      : 0;

  return (
    <Card
      title={title}
      loading={loading}
      style={{
        height: "100%",
      }}
    >
      <Statistic
        value={used}
        suffix={
          total
            ? ` / ${total} ${unit}`
            : unit
        }
      />

      <Progress
        percent={percentage}
        style={{
          marginTop: 16,
        }}
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

export default UsageCard;