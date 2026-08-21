import React from "react";

import {
  Card,
  Col,
  Row,
  Statistic,
  Tag,
} from "antd";

import {
  CheckCircleOutlined,
  StopOutlined,
  LoadingOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";

const InstanceSummary = ({
  instances = [],
  loading = false,
}) => {
  const running =
    instances.filter(
      (instance) =>
        instance.status === "running"
    ).length;

  const stopped =
    instances.filter(
      (instance) =>
        instance.status === "stopped"
    ).length;

  const pending =
    instances.filter(
      (instance) =>
        [
          "pending",
          "creating",
          "starting",
          "stopping",
          "deleting",
        ].includes(
          instance.status
        )
    ).length;

  const total =
    instances.length;

  return (
    <Card
      title="Instance Summary"
      loading={loading}
      extra={
        <Tag
          icon={
            <CloudServerOutlined />
          }
        >
          {total} Total
        </Tag>
      }
    >
      <Row gutter={[16, 16]}>
        <Col
          xs={24}
          sm={8}
        >
          <Statistic
            title="Running"
            value={running}
            prefix={
              <CheckCircleOutlined />
            }
          />
        </Col>

        <Col
          xs={24}
          sm={8}
        >
          <Statistic
            title="Stopped"
            value={stopped}
            prefix={
              <StopOutlined />
            }
          />
        </Col>

        <Col
          xs={24}
          sm={8}
        >
          <Statistic
            title="In Progress"
            value={pending}
            prefix={
              <LoadingOutlined />
            }
          />
        </Col>
      </Row>
    </Card>
  );
};

export default InstanceSummary;