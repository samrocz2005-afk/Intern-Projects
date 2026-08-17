import React, { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Typography,
  message,
} from "antd";

import {
  ArrowLeftOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import { createCategory } from "../../services/categoryApi";
import Breadcrumbs from "../../components/Breadcrumbs";

const { Title } = Typography;

function AddCategory() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const payload = {
        name: values.name.trim(),
        status: values.status,
        description: values.description?.trim() || "",
      };

      await createCategory(payload);

      message.success("Category created successfully");

      form.resetFields();

      navigate("/products/categories");
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to create category"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Automatically generated from URL */}
      <Breadcrumbs />

      <Card>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() =>
              navigate("/products/categories")
            }
            style={{
              paddingLeft: 0,
            }}
            disabled={saving}
          >
            Back to Categories
          </Button>

          <Title
            level={3}
            style={{
              marginTop: 12,
              marginBottom: 0,
            }}
          >
            Add Category
          </Title>
        </div>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          style={{
            maxWidth: 700,
          }}
        >
          {/* Category Name */}
          <Form.Item
            label="Category Name"
            name="name"
            normalize={(value) =>
              typeof value === "string"
                ? value.trimStart()
                : value
            }
            rules={[
              {
                required: true,
                message:
                  "Please enter category name",
              },
              {
                validator: (_, value) => {
                  const name = value?.trim();

                  if (!name) {
                    return Promise.reject(
                      new Error(
                        "Category name cannot be empty or contain only spaces"
                      )
                    );
                  }

                  if (name.length < 2) {
                    return Promise.reject(
                      new Error(
                        "Category name must be at least 2 characters"
                      )
                    );
                  }

                  if (name.length > 100) {
                    return Promise.reject(
                      new Error(
                        "Category name cannot exceed 100 characters"
                      )
                    );
                  }

                  if (/\s{2,}/.test(name)) {
                    return Promise.reject(
                      new Error(
                        "Category name cannot contain consecutive spaces"
                      )
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              maxLength={100}
              placeholder="Enter category name"
              disabled={saving}
            />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label="Status"
            name="status"
            initialValue="Active"
            rules={[
              {
                required: true,
                message:
                  "Please select status",
              },
            ]}
          >
            <Select
              disabled={saving}
              options={[
                {
                  label: "Active",
                  value: "Active",
                },
                {
                  label: "Inactive",
                  value: "Inactive",
                },
              ]}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            normalize={(value) =>
              typeof value === "string"
                ? value.trimStart()
                : value
            }
            rules={[
              {
                validator: (_, value) => {
                  const description =
                    value?.trim();

                  if (!description) {
                    return Promise.resolve();
                  }

                  if (description.length > 500) {
                    return Promise.reject(
                      new Error(
                        "Description cannot exceed 500 characters"
                      )
                    );
                  }

                  if (/\s{2,}/.test(description)) {
                    return Promise.reject(
                      new Error(
                        "Description cannot contain consecutive spaces"
                      )
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              maxLength={500}
              showCount
              placeholder="Enter category description"
              disabled={saving}
            />
          </Form.Item>

          {/* Actions */}
          <Form.Item>
            <Space>
              <Button
                onClick={() =>
                  navigate("/products/categories")
                }
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={saving}
              >
                Save Category
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default AddCategory;