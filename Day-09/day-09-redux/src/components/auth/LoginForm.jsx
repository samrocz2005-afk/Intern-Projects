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
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login, clearError } from "../../features/auth/authSlice";
import {
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "../../features/auth/authSelectors";

const { Title } = Typography;

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values) => {
    dispatch(clearError());

    const credentials = {
      email: values.email.trim().toLowerCase(),
      password: values.password,
    };

    await dispatch(login(credentials));
  };

  return (
    <Card
      style={{
        width: 420,
        margin: "80px auto",
      }}
    >
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%" }}
      >
        <Title
          level={3}
          style={{ textAlign: "center", marginBottom: 0 }}
        >
          Student Login
        </Title>

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
                message: "Enter a valid email address.",
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
              loading={loading}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </Card>
  );
}

export default LoginForm;