import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  InputNumber,
  DatePicker,
  Space,
  Typography,
  message,
} from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

function AddCoupon() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Extract date range from the RangePicker
      const [startDate, endDate] = values.dateRange || [];

      const payload = {
        name: values.name,
        code: values.code,
        type: values.type,
        value: values.value,
        minimumOrderValue: values.minimumOrderValue ?? 0,
        maximumDiscount: values.maximumDiscount ?? null,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        usageLimit: values.usageLimit ?? null,
        status: values.status || "Active",
        description: values.description || "",
      };

      await api.post("/discounts", payload);
      message.success("Coupon created successfully!");
      navigate(-1); // Go back to the discounts list
    } catch (error) {
      console.error("Create Coupon Error:", error.response || error);
      message.error(
        error.response?.data?.message || "Failed to create coupon code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Breadcrumbs
        items={[
          { label: "Operations & Sales" },
          { label: "Discounts & Coupons", href: "/discounts" },
          { label: "Add Coupon" },
        ]}
        style={{ marginBottom: "16px" }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
          gap: "12px",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          type="text"
        />
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Add New Coupon
          </Title>
          <Text type="secondary">
            Fill in the details to create a new promotional discount code.
          </Text>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          type: "Percentage",
          status: "Active",
          minimumOrderValue: 0,
        }}
        style={{ maxWidth: "800px" }}
      >
        <Form.Item
          name="name"
          label="Discount Name"
          rules={[
            { required: true, message: "Discount name is required" },
            { min: 2, message: "Discount name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="e.g. Summer Mega Sale" />
        </Form.Item>

        <Form.Item
          name="code"
          label="Coupon Code"
          rules={[
            { required: true, message: "Coupon code is required" },
            { min: 3, message: "Coupon code must be at least 3 characters" },
          ]}
          normalize={(value) => (value ? value.toUpperCase() : "")}
        >
          <Input placeholder="e.g. SUMMER50" />
        </Form.Item>

        <Space style={{ display: "flex", width: "100%" }} breakpoint="sm" size="large">
          <Form.Item
            name="type"
            label="Discount Type"
            rules={[{ required: true, message: "Please select discount type" }]}
            style={{ flex: 1, minWidth: "240px" }}
          >
            <Select>
              <Option value="Percentage">Percentage (%)</Option>
              <Option value="Fixed">Fixed Amount (₹)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Discount Value"
            rules={[
              { required: true, message: "Discount value is required" },
              {
                validator: (_, value) => {
                  const type = form.getFieldValue("type");
                  if (type === "Percentage" && value > 100) {
                    return Promise.reject(
                      new Error("Percentage discount cannot exceed 100%")
                    );
                  }
                  if (value < 0) {
                    return Promise.reject(
                      new Error("Value cannot be negative")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            style={{ flex: 1, minWidth: "240px" }}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="e.g. 20"
              min={0}
            />
          </Form.Item>
        </Space>

        <Space style={{ display: "flex", width: "100%" }} breakpoint="sm" size="large">
          <Form.Item
            name="minimumOrderValue"
            label="Minimum Order Value (₹)"
            style={{ flex: 1, minWidth: "240px" }}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="0"
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="maximumDiscount"
            label="Maximum Discount Cap (₹) [Optional]"
            style={{ flex: 1, minWidth: "240px" }}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Leave blank for no limit"
              min={0}
            />
          </Form.Item>
        </Space>

        <Form.Item
          name="dateRange"
          label="Active Start & End Date"
          rules={[{ required: true, message: "Start and end dates are required" }]}
        >
          <RangePicker style={{ width: "100%" }} showTime />
        </Form.Item>

        <Space style={{ display: "flex", width: "100%" }} breakpoint="sm" size="large">
          <Form.Item
            name="usageLimit"
            label="Usage Limit [Optional]"
            style={{ flex: 1, minWidth: "240px" }}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Total global uses allowed"
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
            style={{ flex: 1, minWidth: "240px" }}
          >
            <Select>
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Form.Item>
        </Space>

        <Form.Item name="description" label="Description">
          <TextArea rows={4} placeholder="Internal description or notes about this coupon..." />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} loading={loading}>
              Create Coupon
            </Button>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default AddCoupon;