import React from "react";

import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  createFlavor,
} from "../../redux/slices/flavorSlice";

const { Title, Text } = Typography;

const CreateFlavor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const {
    actionLoading,
    error,
  } = useSelector(
    (state) => state.flavors
  );

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    values
  ) => {
    const result = await dispatch(
      createFlavor({
        name: values.name.trim(),

        description:
          values.description?.trim() ||
          "",

        vcpus: values.vcpus,

        ram: values.ram,

        disk: values.disk,

        hourlyPrice:
          values.hourlyPrice,

        monthlyPrice:
          values.monthlyPrice ??
          null,

        isActive:
          values.isActive ?? true,
      })
    );

    if (
      createFlavor.fulfilled.match(
        result
      )
    ) {
      message.success(
        "Flavor created successfully"
      );

      navigate("/flavors");
    } else {
      message.error(
        result.payload?.message ||
          "Failed to create flavor"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div>
      <Card>
        <Space
          direction="vertical"
          size="large"
          style={{
            width: "100%",
          }}
        >
          {/* Header */}

          <div>
            <Button
              type="link"
              icon={
                <ArrowLeftOutlined />
              }
              onClick={() =>
                navigate(
                  "/flavors"
                )
              }
              style={{
                paddingLeft: 0,
              }}
            >
              Back to Flavors
            </Button>

            <Title
              level={3}
              style={{
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              Create Flavor
            </Title>

            <Text type="secondary">
              Create a new compute
              resource configuration.
            </Text>
          </div>

          {/* Error */}

          {error && (
            <Alert
              type="error"
              showIcon
              title={error}
            />
          )}

          {/* Form */}

          <Form
            form={form}
            layout="vertical"
            onFinish={
              handleSubmit
            }
            initialValues={{
              vcpus: 1,
              ram: 1,
              disk: 10,
              hourlyPrice: 0,
              monthlyPrice: null,
              isActive: true,
            }}
            style={{
              maxWidth: 700,
            }}
          >
            <Form.Item
              label="Flavor Name"
              name="name"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter a flavor name",
                },
                {
                  min: 2,
                  message:
                    "Flavor name must contain at least 2 characters",
                },
                {
                  max: 100,
                  message:
                    "Flavor name cannot exceed 100 characters",
                },
              ]}
            >
              <Input
                placeholder="Example: small"
                maxLength={100}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
            >
              <Input.TextArea
                placeholder="Describe this flavor"
                rows={4}
                maxLength={300}
                showCount
              />
            </Form.Item>

            <Form.Item
              label="vCPUs"
              name="vcpus"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter vCPU count",
                },
                {
                  type: "number",
                  min: 1,
                  message:
                    "vCPU must be at least 1",
                },
              ]}
            >
              <InputNumber
                min={1}
                precision={0}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              label="RAM (GB)"
              name="ram"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter RAM",
                },
                {
                  type: "number",
                  min: 1,
                  message:
                    "RAM must be at least 1 GB",
                },
              ]}
            >
              <InputNumber
                min={1}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Disk (GB)"
              name="disk"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter disk size",
                },
                {
                  type: "number",
                  min: 1,
                  message:
                    "Disk must be at least 1 GB",
                },
              ]}
            >
              <InputNumber
                min={1}
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

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
                    "Price cannot be negative",
                },
              ]}
            >
              <InputNumber
                min={0}
                precision={4}
                step={0.0001}
                prefix="₹"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Monthly Price"
              name="monthlyPrice"
              rules={[
                {
                  type: "number",
                  min: 0,
                  message:
                    "Price cannot be negative",
                },
              ]}
            >
              <InputNumber
                min={0}
                precision={2}
                prefix="₹"
                placeholder="Optional"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  onClick={() =>
                    navigate(
                      "/flavors"
                    )
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="primary"
                  htmlType="submit"
                  icon={
                    <SaveOutlined />
                  }
                  loading={
                    actionLoading
                  }
                >
                  Create Flavor
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default CreateFlavor;