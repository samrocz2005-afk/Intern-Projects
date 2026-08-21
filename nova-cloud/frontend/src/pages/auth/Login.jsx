import React, { useEffect } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
} from "antd";

import {
  LockOutlined,
  MailOutlined,
  LoginOutlined,
} from "@ant-design/icons";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
    loading,
    error,
    clearError,
  } = useAuth();

  const [form] = Form.useForm();

  /*
  |--------------------------------------------------------------------------
  | Redirect authenticated users
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath =
        location.state?.from?.pathname ||
        "/dashboard";

      navigate(redirectPath, {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    location.state,
    navigate,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    values
  ) => {
    clearError();

    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      });

      message.success(
        "Login successful"
      );
    } catch (error) {
      /*
       * authSlice/useAuth already
       * stores the backend error.
       */
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#f5f5f5",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          <Title
            level={2}
            style={{
              marginBottom: 8,
            }}
          >
            Cloud Platform
          </Title>

          <Text type="secondary">
            Sign in to your account
          </Text>
        </div>

        {error && (
          <Alert
            type="error"
            showIcon
            message={error}
            closable
            onClose={clearError}
            style={{
              marginBottom: 20,
            }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          autoComplete="on"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message:
                  "Please enter your email",
              },
              {
                type: "email",
                message:
                  "Please enter a valid email",
              },
            ]}
          >
            <Input
              prefix={
                <MailOutlined />
              }
              placeholder="Enter your email"
              size="large"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message:
                  "Please enter your password",
              },
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined />
              }
              placeholder="Enter your password"
              size="large"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item
            style={{
              marginBottom: 12,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              icon={<LoginOutlined />}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
          }}
        >
          <Text type="secondary">
            Don't have an account?{" "}
          </Text>

          <Link to="/register">
            Create account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;