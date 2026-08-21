import React from "react";

import {
  Card,
  Empty,
  Typography,
} from "antd";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const { Text } = Typography;

const UsageChart = ({
  data = [],
  title = "Resource Usage",
  loading = false,
  dataKey = "usage",
  xAxisKey = "time",
  unit = "%",
}) => {
  return (
    <Card
      title={title}
      loading={loading}
    >
      {!data.length ? (
        <Empty
          image={
            Empty.PRESENTED_IMAGE_SIMPLE
          }
          description="No usage data available"
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: 300,
          }}
        >
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid />

              <XAxis
                dataKey={xAxisKey}
              />

              <YAxis
                unit={unit}
              />

              <Tooltip
                formatter={(value) =>
                  `${value}${unit}`
                }
              />

              <Area
                type="monotone"
                dataKey={dataKey}
                fillOpacity={0.25}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default UsageChart;