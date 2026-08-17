import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
  message,
} from "antd";
import {
  BellOutlined,
  LockOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import Breadcrumbs from "../../components/Breadcrumbs";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get("/settings/profile");
        const settingsData = response?.data?.data || response?.data || {};
        
        // Populate form and states
        form.setFieldsValue({
          language: settingsData.language || "English",
        });
        setNotifications(settingsData.notifications ?? true);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };

    fetchSettings();
  }, [form]);

  const handleSave = async (values) => {
    try {
      setLoading(true);
      const payload = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        notifications,
        language: values.language,
      };

      await api.put("/settings/profile", payload);
      message.success("Settings and password updated successfully!");
      
      // Clear password fields after success
      form.setFieldsValue({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Save settings error:", error);
      message.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumbs />
      <div style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ marginBottom: "4px" }}>
          Settings
        </Title>
        <Text type="secondary">
          Manage your account security and application preferences
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <LockOutlined />
                  Security
                </Space>
              }
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter your current password",
                  },
                ]}
              >
                <Input.Password placeholder="Enter current password" />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: "Please enter a new password",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters",
                  },
                ]}
              >
                <Input.Password placeholder="Enter new password" />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        getFieldValue("newPassword") === value
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm new password" />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <Space>
                  <BellOutlined />
                  Preferences
                </Space>
              }
            >
              <Row gutter={[24, 16]}>
                <Col xs={24}>
                  <Space>
                    <Switch
                      checked={notifications}
                      onChange={setNotifications}
                    />
                    <div>
                      <Text strong>Notifications</Text>
                      <br />
                      <Text type="secondary">
                        Receive application push notifications & alerts
                      </Text>
                    </div>
                  </Space>
                </Col>
              </Row>

              <Form.Item
                label="Language"
                name="language"
                initialValue="English"
                style={{
                  marginTop: "24px",
                  maxWidth: 300,
                }}
              >
                <Select
                  options={[
                    { label: "English", value: "English" },
                    { label: "Tamil", value: "Tamil" },
                  ]}
                />
              </Form.Item>
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
            Save Settings
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Settings;