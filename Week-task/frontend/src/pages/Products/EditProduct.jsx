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

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";

import {
  getProductById,
  updateProduct,
} from "../../services/productApi";

import {
  getCategories,
} from "../../services/categoryApi";

const { Title } = Typography;

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] =
    useState(false);

  /*
   * --------------------------------------------------
   * Load Product
   * --------------------------------------------------
   */

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const response = await getProductById(id);

        const product = response.data;

        if (!product) {
          message.error("Product not found");

          navigate("/products/all-products");

          return;
        }

        form.setFieldsValue({
          name: product.name,

          category:
            typeof product.category === "object"
              ? product.category?._id
              : product.category,

          price: product.price,
          stock: product.stock,
          description: product.description,
        });
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to load product"
        );

        navigate("/products/all-products");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, form, navigate]);

  /*
   * --------------------------------------------------
   * Load Categories
   * --------------------------------------------------
   */

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

  /*
   * --------------------------------------------------
   * Submit
   * --------------------------------------------------
   */

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      await updateProduct(id, {
        name: values.name,
        category: values.category,
        price: values.price,
        stock: values.stock,
        description: values.description,
      });

      message.success(
        "Product updated successfully"
      );

      navigate("/products/all-products");
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

  return (
    <Card loading={loading}>
      {/* Global Breadcrumb */}
      <Breadcrumbs />

      {/* Page Header */}
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
          }}
        >
          Edit Product
        </Title>
      </div>

      {/* Product Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{
          maxWidth: 700,
        }}
      >
        {/* Product Name */}
        <Form.Item
          label="Product Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter product name",
            },
            {
              min: 2,
              message:
                "Product name must be at least 2 characters",
            },
          ]}
        >
          <Input
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
            showSearch
            optionFilterProp="label"
            options={categories.map(
              (category) => ({
                label: category.name,
                value: category._id,
              })
            )}
          />
        </Form.Item>

        {/* Price */}
        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message:
                "Please enter product price",
            },
          ]}
        >
          <InputNumber
            min={0}
            prefix="₹"
            placeholder="Enter price"
            style={{
              width: "100%",
            }}
          />
        </Form.Item>

        {/* Stock */}
        <Form.Item
          label="Stock"
          name="stock"
          rules={[
            {
              required: true,
              message:
                "Please enter stock quantity",
            },
          ]}
        >
          <InputNumber
            min={0}
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
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter product description"
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
              Update Product
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default EditProduct;