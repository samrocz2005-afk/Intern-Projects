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
  Space,
  Typography,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  createNetwork,
} from "../../redux/slices/networkSlice";

import {
  selectNetworksLoading,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const CreateNetwork = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const { setBreadcrumbs } = useBreadcrumb();

  const loading = useSelector(
    selectNetworksLoading
  );

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    setBreadcrumbs([
      {
        title: "Dashboard",
        path: "/dashboard",
      },
      {
        title: "Networks",
        path: "/networks",
      },
      {
        title: "Create Network",
        path: "/networks/create",
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

      const payload = {
        name: values.name.trim(),

        cidr: values.cidr.trim(),

        gateway:
          values.gateway?.trim() || null,

        description:
          values.description?.trim() || null,

        type:
          values.type || "private",

        isDefault:
          values.isDefault || false,

        /*
        |--------------------------------------------------------------------------
        | ADMIN PRICING
        |--------------------------------------------------------------------------
        */

        hourlyPrice: Number(
          values.hourlyPrice
        ),

        monthlyPrice:
          values.monthlyPrice !== undefined &&
          values.monthlyPrice !== null &&
          values.monthlyPrice !== ""
            ? Number(values.monthlyPrice)
            : null,
      };

      const network = await dispatch(
        createNetwork(payload)
      ).unwrap();

      message.success(
        "Network created successfully"
      );

      const id =
        network?._id ||
        network?.id ||
        network?.data?._id ||
        network?.data?.id;

      if (id) {
        navigate(`/networks/${id}`);
      } else {
        navigate("/networks");
      }
    } catch (error) {
      /*
      |--------------------------------------------------------------------------
      | Better backend validation message
      |--------------------------------------------------------------------------
      */

      const errorMessage =
        error?.message ||
        error?.errors?.[0]?.message ||
        "Failed to create network";

      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

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
              navigate("/networks")
            }
          >
            Back to Networks
          </Button>

          <Title
            level={2}
            style={{
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            Create Network
          </Title>

          <Text type="secondary">
            Create a cloud network and configure
            its pricing.
          </Text>
        </div>

        <Card>
          <Alert
            type="info"
            showIcon
            message="Network configuration"
            description="Configure the network CIDR, gateway, and administrator pricing. Users will only be able to view active networks."
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
              type: "private",
              hourlyPrice: 0,
              monthlyPrice: null,
              isDefault: false,
            }}
          >
            <Row gutter={[16, 0]}>
              {/* Network Name */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Network Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter a network name",
                    },
                    {
                      min: 2,
                      message:
                        "Name must be at least 2 characters",
                    },
                    {
                      max: 50,
                      message:
                        "Name cannot exceed 50 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={
                      <GlobalOutlined />
                    }
                    placeholder="my-network"
                  />
                </Form.Item>
              </Col>

              {/* CIDR */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="CIDR"
                  name="cidr"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter a CIDR",
                    },
                    {
                      pattern:
                        /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\/(?:[0-9]|[12]\d|3[0-2])$/,
                      message:
                        "Enter a valid IPv4 CIDR, e.g. 10.0.0.0/24",
                    },
                  ]}
                >
                  <Input
                    placeholder="10.0.0.0/24"
                  />
                </Form.Item>
              </Col>

              {/* Gateway */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Gateway"
                  name="gateway"
                  rules={[
                    {
                      pattern:
                        /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
                      message:
                        "Enter a valid IPv4 address",
                    },
                  ]}
                >
                  <Input
                    placeholder="10.0.0.1"
                  />
                </Form.Item>
              </Col>

              {/* Network Type */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Network Type"
                  name="type"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <select
                    style={{
                      width: "100%",
                      height: 32,
                      border:
                        "1px solid #d9d9d9",
                      borderRadius: 6,
                      padding: "0 11px",
                      background: "#fff",
                    }}
                  >
                    <option value="private">
                      Private
                    </option>

                    <option value="public">
                      Public
                    </option>
                  </select>
                </Form.Item>
              </Col>

              {/* Hourly Price */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Hourly Price (₹)"
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
                    style={{
                      width: "100%",
                    }}
                    min={0}
                    step={0.01}
                    precision={2}
                    placeholder="100"
                    addonBefore="₹"
                  />
                </Form.Item>
              </Col>

              {/* Monthly Price */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Monthly Price (₹)"
                  name="monthlyPrice"
                >
                  <InputNumber
                    style={{
                      width: "100%",
                    }}
                    min={0}
                    step={0.01}
                    precision={2}
                    placeholder="Optional"
                    addonBefore="₹"
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
                      max: 300,
                      message:
                        "Description cannot exceed 300 characters",
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Optional network description"
                    showCount
                    maxLength={300}
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
                    navigate("/networks")
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
                  Create Network
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default CreateNetwork;