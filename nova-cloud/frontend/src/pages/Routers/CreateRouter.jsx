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
  SwapOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  createRouter,
} from "../../redux/slices/routerSlice";

import {
  fetchNetworks,
} from "../../redux/slices/networkSlice";

import {
  selectNetworks,
  selectNetworksLoading,
  selectRoutersLoading,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const CreateRouter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const { setBreadcrumbs } =
    useBreadcrumb();

  /*
  |--------------------------------------------------------------------------
  | Auth
  |--------------------------------------------------------------------------
  */

  const user = useSelector(
    (state) => state.auth.user
  );

  /*
  |--------------------------------------------------------------------------
  | Networks
  |--------------------------------------------------------------------------
  */

  const networks = useSelector(
    selectNetworks
  );

  const networksLoading = useSelector(
    selectNetworksLoading
  );

  /*
  |--------------------------------------------------------------------------
  | Router Loading
  |--------------------------------------------------------------------------
  */

  const routerLoading = useSelector(
    selectRoutersLoading
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
        title: "Routers",
        path: "/routers",
      },
      {
        title: "Create Router",
        path: "/routers/create",
      },
    ]);
  }, [setBreadcrumbs]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Networks
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (user) {
      dispatch(fetchNetworks());
    }
  }, [dispatch, user]);

  /*
  |--------------------------------------------------------------------------
  | Network Options
  |--------------------------------------------------------------------------
  */

  const networkOptions = networks
    .filter(
      (network) =>
        network?.status === "active"
    )
    .map((network) => {
      const id =
        network?._id ||
        network?.id;

      return {
        value: id,
        label: `${network?.name || "Unnamed Network"}${
          network?.cidr
            ? ` (${network.cidr})`
            : ""
        }`,
      };
    })
    .filter(
      (network) => network.value
    );

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

        networkId: values.networkId,

        gateway:
          values.gateway?.trim() || null,

        description:
          values.description?.trim() || null,

        /*
         * IMPORTANT
         * InputNumber already returns a number.
         */
        hourlyPrice:
          Number(values.hourlyPrice),
      };

      console.log(
        "Create Router Payload:",
        payload
      );

      const router = await dispatch(
        createRouter(payload)
      ).unwrap();

      message.success(
        "Router created successfully"
      );

      const id =
        router?._id ||
        router?.id;

      if (id) {
        navigate(`/routers/${id}`);
      } else {
        navigate("/routers");
      }
    } catch (error) {
      console.error(
        "Create router error:",
        error
      );

      message.error(
        error?.message ||
          "Failed to create router"
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
            icon={
              <ArrowLeftOutlined />
            }
            onClick={() =>
              navigate("/routers")
            }
          >
            Back to Routers
          </Button>

          <Title
            level={2}
            style={{
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            Create Router
          </Title>

          <Text type="secondary">
            Configure a router for network
            connectivity.
          </Text>
        </div>

        <Card>
          <Alert
            type="info"
            showIcon
            message="Router configuration"
            description="Select an active network and configure the router pricing."
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
              hourlyPrice: 0,
            }}
          >
            <Row gutter={[16, 0]}>
              {/* Router Name */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Router Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter a router name",
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
                      <SwapOutlined />
                    }
                    placeholder="my-router"
                  />
                </Form.Item>
              </Col>

              {/* Network */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Network"
                  name="networkId"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please select a network",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    loading={
                      networksLoading
                    }
                    placeholder={
                      networksLoading
                        ? "Loading networks..."
                        : "Select network"
                    }
                    optionFilterProp="label"
                    options={
                      networkOptions
                    }
                    notFoundContent={
                      networksLoading
                        ? "Loading networks..."
                        : "No active networks available"
                    }
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
                    style={{
                      width: "100%",
                    }}
                    min={0}
                    precision={2}
                    prefix="₹"
                    placeholder="0.00"
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
                    placeholder="Optional router description"
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
                    navigate("/routers")
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  loading={
                    submitting ||
                    routerLoading ||
                    networksLoading
                  }
                  disabled={
                    networksLoading ||
                    networkOptions.length === 0
                  }
                >
                  Create Router
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default CreateRouter;