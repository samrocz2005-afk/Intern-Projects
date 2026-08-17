import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { SaveOutlined, UserOutlined, EnvironmentOutlined } from "@ant-design/icons";

import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Profile() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Fetch user profile data on component load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        const profileData = response?.data?.data || response?.data || {};

        form.setFieldsValue({
          name: profileData.name || profileData.fullName || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          addressLine1: profileData.address?.addressLine1 || "",
          addressLine2: profileData.address?.addressLine2 || "",
          city: profileData.address?.city || "",
          state: profileData.address?.state || "",
          postalCode: profileData.address?.postalCode || "",
          country: profileData.address?.country || "India",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        message.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [form]);

  const handleSave = async (values) => {
    try {
      setLoading(true);

      // Structure values to match your backend model schema (nesting address subdocument)
      const payload = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: {
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: values.country,
        },
      };

      await api.put("/profile", payload);
      message.success("Profile saved successfully");
    } catch (error) {
      console.error("Save profile error:", error);
      message.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumbs />
      <div style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ marginBottom: "4px" }}>
          Profile
        </Title>
        <Text type="secondary">
          Manage your personal account information and address details
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Row gutter={[16, 16]}>
          {/* Personal Details Card */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <UserOutlined />
                  Personal Details
                </Space>
              }
              style={{ height: "100%" }}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please enter your name",
                  },
                ]}
              >
                <Input placeholder="Enter your name" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email",
                  },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Card>
          </Col>

          {/* Address Details Card */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <EnvironmentOutlined />
                  Address Details
                </Space>
              }
            >
              <Form.Item label="Address Line 1" name="addressLine1">
                <Input placeholder="Street address or P.O. Box" />
              </Form.Item>

              <Form.Item label="Address Line 2" name="addressLine2">
                <Input placeholder="Apartment, suite, unit, etc." />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={12}>
                  <Form.Item label="City" name="city">
                    <Input placeholder="City" />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item label="State" name="state">
                    <Input placeholder="State" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={12}>
                  <Form.Item label="Postal Code" name="postalCode">
                    <Input placeholder="Postal code" />
                  </Form.Item>
                </Col>
                <Col xs={12}>
                  <Form.Item label="Country" name="country">
                    <Input placeholder="Country" />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <div style={{ marginTop: "24px" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Save Profile
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Profile;