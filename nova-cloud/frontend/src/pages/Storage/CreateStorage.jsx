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
  Switch,
  Typography,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  HddOutlined,
} from "@ant-design/icons";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
  createStorage,
} from "../../redux/slices/storageSlice";

import {
  selectStorageLoading,
} from "../../redux/selectors/resourceSelectors";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const { Title, Text } = Typography;

const CreateStorage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const { setBreadcrumbs } =
    useBreadcrumb();

  const loading = useSelector(
    selectStorageLoading
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
        title: "Storage",
        path: "/storage",
      },
      {
        title: "Create Storage",
        path: "/storage/create",
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

      /*
       * Build the exact payload expected by backend.
       */
      const payload = {
        name: values.name.trim(),

        size: Number(values.size),

        type: values.type,

        encrypted:
          values.encrypted ?? true,

        hourlyPrice: Number(
          values.hourlyPrice
        ),

        description:
          values.description?.trim() || null,
      };

      /*
       * Debug payload.
       * Remove this after testing.
       */
      console.log(
        "Create Storage Payload:",
        payload
      );

      const storage = await dispatch(
        createStorage(payload)
      ).unwrap();

      message.success(
        "Storage created successfully"
      );

      const id =
        storage?._id ||
        storage?.id ||
        storage?.data?._id ||
        storage?.data?.id;

      if (id) {
        navigate(`/storage/${id}`);
      } else {
        navigate("/storage");
      }
    } catch (error) {
      console.error(
        "Create Storage Error:",
        error
      );

      message.error(
        error?.message ||
          "Failed to create storage"
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
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
              navigate("/storage")
            }
          >
            Back to Storage
          </Button>

          <Title
            level={2}
            style={{
              marginTop: 12,
              marginBottom: 4,
            }}
          >
            Create Storage
          </Title>

          <Text type="secondary">
            Create a persistent storage volume.
          </Text>
        </div>

        {/* Card */}

        <Card>
          <Alert
            type="info"
            showIcon
            message="Storage billing"
            description="Storage charges are calculated according to the configured storage size, hourly price, and usage duration."
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
              type: "ssd",
              size: 20,
              hourlyPrice: 0,
              encrypted: true,
            }}
          >
            <Row gutter={[16, 0]}>
              {/* Storage Name */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Storage Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter a storage name",
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
                      <HddOutlined />
                    }
                    placeholder="my-storage"
                  />
                </Form.Item>
              </Col>

              {/* Storage Type */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Storage Type"
                  name="type"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please select a storage type",
                    },
                  ]}
                >
                  <Select
                    options={[
                      {
                        value: "ssd",
                        label: "SSD",
                      },
                      {
                        value: "hdd",
                        label: "HDD",
                      },
                      {
                        value: "nvme",
                        label: "NVMe",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>

              {/* Size */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Size"
                  name="size"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please enter storage size",
                    },
                    {
                      type: "number",
                      min: 1,
                      max: 65536,
                      message:
                        "Storage must be between 1 and 65536 GB",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={65536}
                    addonAfter="GB"
                    style={{
                      width: "100%",
                    }}
                    placeholder="20"
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

              {/* Encryption */}

              <Col xs={24} md={12}>
                <Form.Item
                  label="Encryption"
                  name="encrypted"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Enabled"
                    unCheckedChildren="Disabled"
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
                    navigate("/storage")
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
                  Create Storage
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </div>
  );
};

export default CreateStorage;