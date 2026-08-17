import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
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

import Breadcrumbs from "../../components/Breadcrumbs";

import { createProduct } from "../../services/productApi";
import { getCategories } from "../../services/categoryApi";

const { Title } = Typography;

function AddProduct() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await getCategories({
          page: 1,
          limit: 100,
          status: "Active",
        });

        setCategories(response.data || []);
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to load categories"
        );
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      await createProduct({
        sku: values.sku.trim(),
        name: values.name.trim().replace(/\s+/g, " "),
        category: values.category,
        price: values.price,
        stock: values.stock,
        description:
          values.description?.trim().replace(/\s+/g, " ") || "",
      });

      message.success("Product created successfully");

      form.resetFields();

      navigate("/products/all-products");
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      {/* Global Breadcrumb */}
      <Breadcrumbs />

      <div style={{ marginBottom: 24 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() =>
            navigate("/products/all-products")
          }
          style={{
            paddingLeft: 0,
          }}
          disabled={saving}
        >
          Back to Products
        </Button>

        <Title
          level={3}
          style={{
            marginTop: 12,
            marginBottom: 0,
          }}
        >
          Add Product
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        style={{
          maxWidth: 700,
        }}
      >
        {/* SKU */}
        <Form.Item
          label="SKU"
          name="sku"
          normalize={(value) =>
            typeof value === "string"
              ? value.trimStart()
              : value
          }
          rules={[
            {
              required: true,
              message: "Please enter product SKU",
            },
            {
              validator: (_, value) => {
                const sku = value?.trim();

                if (!sku) {
                  return Promise.reject(
                    new Error(
                      "SKU cannot be empty or contain only spaces"
                    )
                  );
                }

                if (sku.length < 3) {
                  return Promise.reject(
                    new Error(
                      "SKU must be at least 3 characters"
                    )
                  );
                }

                if (sku.length > 50) {
                  return Promise.reject(
                    new Error(
                      "SKU cannot exceed 50 characters"
                    )
                  );
                }

                if (!/^[A-Za-z0-9_-]+$/.test(sku)) {
                  return Promise.reject(
                    new Error(
                      "SKU can contain only letters, numbers, hyphens and underscores"
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            maxLength={50}
            placeholder="Enter unique product SKU (e.g., PROD-001)"
          />
        </Form.Item>

        {/* Product Name */}
        <Form.Item
          label="Product Name"
          name="name"
          normalize={(value) =>
            typeof value === "string"
              ? value.trimStart()
              : value
          }
          rules={[
            {
              required: true,
              message: "Please enter product name",
            },
            {
              validator: (_, value) => {
                const name = value?.trim();

                if (!name) {
                  return Promise.reject(
                    new Error(
                      "Product name cannot be empty or contain only spaces"
                    )
                  );
                }

                if (name.length < 2) {
                  return Promise.reject(
                    new Error(
                      "Product name must be at least 2 characters"
                    )
                  );
                }

                if (name.length > 100) {
                  return Promise.reject(
                    new Error(
                      "Product name cannot exceed 100 characters"
                    )
                  );
                }

                if (/\s{2,}/.test(name)) {
                  return Promise.reject(
                    new Error(
                      "Product name cannot contain consecutive spaces"
                    )
                  );
                }

                if (!/[A-Za-z0-9]/.test(name)) {
                  return Promise.reject(
                    new Error(
                      "Product name must contain letters or numbers"
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
            placeholder="Enter product name"
          />
        </Form.Item>

        {/* Category */}
        <Form.Item
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: "Please select a category",
            },
          ]}
        >
          <Select
            placeholder="Select category"
            loading={categoriesLoading}
            disabled={categoriesLoading}
            showSearch
            optionFilterProp="label"
            notFoundContent={
              categoriesLoading
                ? "Loading categories..."
                : "No active categories found"
            }
            options={categories
              .filter(
                (category) =>
                  category?._id &&
                  category?.name?.trim()
              )
              .map((category) => ({
                label: category.name.trim(),
                value: category._id,
              }))}
          />
        </Form.Item>

        {/* Price */}
        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Please enter product price",
            },
            {
              type: "number",
              min: 0.01,
              message: "Price must be greater than 0",
            },
            {
              validator: (_, value) => {
                if (value === undefined || value === null) {
                  return Promise.resolve();
                }

                if (!Number.isFinite(value)) {
                  return Promise.reject(
                    new Error("Please enter a valid price")
                  );
                }

                if (value > 99999999.99) {
                  return Promise.reject(
                    new Error(
                      "Price cannot exceed ₹99,999,999.99"
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0}
            max={99999999.99}
            step={0.01}
            precision={2}
            placeholder="Enter price"
            style={{
              width: "100%",
            }}
            prefix="₹"
          />
        </Form.Item>

        {/* Stock */}
        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            {
              required: true,
              message: "Please enter stock quantity",
            },
            {
              type: "integer",
              message: "Stock must be a whole number",
            },
            {
              type: "number",
              min: 0,
              message: "Stock cannot be negative",
            },
            {
              validator: (_, value) => {
                if (value === undefined || value === null) {
                  return Promise.resolve();
                }

                if (!Number.isSafeInteger(value)) {
                  return Promise.reject(
                    new Error(
                      "Stock must be a valid whole number"
                    )
                  );
                }

                if (value > 9999999) {
                  return Promise.reject(
                    new Error(
                      "Stock cannot exceed 9,999,999"
                    )
                  );
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            min={0}
            max={9999999}
            precision={0}
            placeholder="Enter stock quantity"
            style={{
              width: "100%",
            }}
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
                const description = value?.trim();

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
            placeholder="Enter product description (optional)"
          />
        </Form.Item>

        {/* Actions */}
        <Form.Item>
          <Space>
            <Button
              onClick={() =>
                navigate("/products/all-products")
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
              Save Product
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default AddProduct;