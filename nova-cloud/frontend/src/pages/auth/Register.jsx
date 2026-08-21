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
  UserOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const { Title, Text } = Typography;

const Register = () => {
  const navigate =
    useNavigate();

  const {
    register,
    isAuthenticated,
    loading,
    error,
    clearError,
  } = useAuth();

  const [form] =
    Form.useForm();

  /*
  |--------------------------------------------------------------------------
  | Redirect authenticated users
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
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
      await register({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      message.success(
        "Account created successfully"
      );

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      /*
       * Error is already stored
       * inside authSlice.
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
          maxWidth: 460,
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
            Create Account
          </Title>

          <Text type="secondary">
            Create your cloud platform account
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
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message:
                  "Please enter your name",
              },
              {
                min: 2,
                message:
                  "Name must be at least 2 characters",
              },
              {
                max: 100,
                message:
                  "Name cannot exceed 100 characters",
              },
            ]}
          >
            <Input
              prefix={
                <UserOutlined />
              }
              placeholder="Enter your name"
              size="large"
              autoComplete="name"
            />
          </Form.Item>

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
                  "Please enter a password",
              },
              {
                min: 8,
                message:
                  "Password must be at least 8 characters",
              },
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined />
              }
              placeholder="Create a password"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={[
              "password",
            ]}
            rules={[
              {
                required: true,
                message:
                  "Please confirm your password",
              },
              ({ getFieldValue }) => ({
                validator(
                  _,
                  value
                ) {
                  if (
                    !value ||
                    getFieldValue(
                      "password"
                    ) === value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "Passwords do not match"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={
                <LockOutlined />
              }
              placeholder="Confirm your password"
              size="large"
              autoComplete="new-password"
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
              icon={
                <UserAddOutlined />
              }
            >
              Create Account
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
            Already have an account?{" "}
          </Text>

          <Link to="/login">
            Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;