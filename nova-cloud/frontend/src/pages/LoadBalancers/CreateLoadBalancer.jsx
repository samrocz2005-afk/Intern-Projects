import React, { useEffect, useState } from "react";

import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  createLoadBalancer,
} from "../../redux/slices/loadBalancerSlice";

import {
  selectLoadBalancersLoading,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const CreateLoadBalancer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const { setBreadcrumbs } =
    useBreadcrumb();

  const loading = useSelector(
    selectLoadBalancersLoading
  );

  const [submitting, setSubmitting] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Breadcrumb
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Dashboard",
        path: "/dashboard",
      },
      {
        title: "Load Balancers",
        path: "/load-balancers",
      },
      {
        title: "Create Load Balancer",
        path: "/load-balancers/create",
      },
    ]);
  }, [setBreadcrumbs]);

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      const loadBalancer =
        await dispatch(
          createLoadBalancer({
            name: values.name.trim(),

            description:
              values.description?.trim() || null,
            algorithm: values.algorithm,

            /*
             * Backend expects:
             * HTTP
             * HTTPS
             * TCP
             */
            protocol: values.protocol,

            /*
             * Backend requires separate
             * listener and target ports.
             */
            listenerPort:
              values.listenerPort,

            targetPort:
              values.targetPort,

            /*
             * Backend requires hourlyPrice.
             */
            hourlyPrice:
              Number(values.hourlyPrice),

            /*
             * Backend supports healthCheck.
             */
            healthCheck:
              values.healthCheck,
          })
        ).unwrap();

      message.success(
        "Load balancer created successfully"
      );

      const id =
        loadBalancer?._id ||
        loadBalancer?.id;

      if (id) {
        navigate(
          `/load-balancers/${id}`
        );
      } else {
        navigate("/load-balancers");
      }
    } catch (error) {
      message.error(
        error?.message ||
          "Failed to create load balancer"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Space
        direction="vertical"
        size={24}
        style={{
          width: "100%",
        }}
      >
        {/* Header */}

        <div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() =>
              navigate("/load-balancers")
            }
          >
            Back to Load Balancers
          </Button>

          <Title
            level={2}
            style={{
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            Create Load Balancer
          </Title>

          <Text type="secondary">
            Configure a load balancer to
            distribute traffic across
            instances.
          </Text>
        </div>

        <Card>
          <Alert
            type="info"
            showIcon
            message="Load balancer billing"
            description="Load balancer charges are calculated by the backend billing service according to the configured hourly price and usage duration."
            style={{
              marginBottom: 24,
            }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark="optional"
            initialValues={{
              algorithm: "round_robin",
              protocol: "HTTP",
              listenerPort: 80,
              targetPort: 80,
              hourlyPrice: 0,
              healthCheck: true,
            }}
          >
            <Row gutter={[16, 0]}>
              {/* Name */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter a load balancer name",
                    },
                    {
                      min: 2,
                      message:
                        "Name must be at least 2 characters",
                    },
                    {
                      max: 100,
                      message:
                        "Name cannot exceed 100 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <CloudServerOutlined />
                    }
                    placeholder="my-load-balancer"
                  />
                </Form.Item>
              </Col>

              {/* Algorithm */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Algorithm"
                  name="algorithm"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please select an algorithm",
                    },
                  ]}
                >
                  <Select
                    options={[
                      {
                        value: "round_robin",
                        label: "Round Robin",
                      },
                      {
                        value:
                          "least_connections",
                        label:
                          "Least Connections",
                      },
                      {
                        value: "ip_hash",
                        label: "IP Hash",
                      },
                      {
                        value: "random",
                        label: "Random",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* Protocol */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Protocol"
                  name="protocol"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please select a protocol",
                    },
                  ]}
                >
                  <Select
                    options={[
                      {
                        value: "HTTP",
                        label: "HTTP",
                      },
                      {
                        value: "HTTPS",
                        label: "HTTPS",
                      },
                      {
                        value: "TCP",
                        label: "TCP",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* Listener Port */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Listener Port"
                  name="listenerPort"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter listener port",
                    },
                    {
                      type: "number",
                      min: 1,
                      max: 65535,
                      message:
                        "Listener port must be between 1 and 65535",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={65535}
                    style={{
                      width: "100%",
                    }}
                    placeholder="80"
                  />
                </Form.Item>
              </Col>

              {/* Target Port */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Target Port"
                  name="targetPort"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter target port",
                    },
                    {
                      type: "number",
                      min: 1,
                      max: 65535,
                      message:
                        "Target port must be between 1 and 65535",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={65535}
                    style={{
                      width: "100%",
                    }}
                    placeholder="80"
                  />
                </Form.Item>
              </Col>

              {/* Hourly Price */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Hourly Price"
                  name="hourlyPrice"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter hourly price",
                    },
                    {
                      type: "number",
                      min: 0,
                      message:
                        "Hourly price cannot be negative",
                    },
                  ]}
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    prefix="₹"
                    style={{
                      width: "100%",
                    }}
                    placeholder="0.00"
                  />
                </Form.Item>
              </Col>

              {/* Health Check */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Health Check"
                  name="healthCheck"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    options={[
                      {
                        value: true,
                        label: "Enabled",
                      },
                      {
                        value: false,
                        label: "Disabled",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* Description */}

              <Col xs={24}>
                <Form.Item
                  label="Description"
                  name="description"
                  rules={[
                    {
                      max: 500,
                      message:
                        "Description cannot exceed 500 characters",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    showCount
                    maxLength={500}
                    placeholder="Optional description"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Buttons */}

            <Form.Item
              style={{
                marginBottom: 0,
              }}
            >
              <Space>
                <Button
                  onClick={() =>
                    navigate(
                      "/load-balancers"
                    )
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    submitting || loading
                  }
                >
                  Create Load Balancer
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default CreateLoadBalancer;