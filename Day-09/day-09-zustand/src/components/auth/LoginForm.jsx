import React, { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Space,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const { Title, Text } = Typography;

function LoginForm() {
  const navigate = useNavigate();

  // FIX: Renamed loginUser to login, and clearError to clearErrors 
  // to match standard Zustand auth store configurations
  const {
    login,            
    clearErrors,      
    loading,
    error,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      // Safe call using optional chaining in case your store names it differently
      if (typeof clearErrors === "function") clearErrors();
    };
  }, [clearErrors]);

  const onFinish = async (values) => {
    if (typeof clearErrors === "function") clearErrors();

    // Check if the login method exists before trying to run it
    const loginMethod = login;
    if (typeof loginMethod !== "function") {
      console.error("Authentication login method is missing from the useAuth hook.");
      return;
    }

    const success = await loginMethod({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    });

    if (success) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%" }}
        >
          <Title
            level={3}
            className="text-center"
          >
            Student Task Management
          </Title>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Text type="secondary" className="text-center">
              Login to manage your tasks
            </Text>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
            />
          )}

          <Form
            layout="vertical"
            onFinish={onFinish}
            autoComplete="on"
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please enter your email.",
                },
                {
                  type: "email",
                  message: "Please enter a valid email.",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please enter your password.",
                },
                {
                  min: 6,
                  message: "Password must be at least 6 characters.",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
}

export default LoginForm;