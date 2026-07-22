import React from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const onFinish = async (values) => {
    try {
      console.log("Login Form Values:", values);

      await login(values);

      message.success("Login successful");

      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Library Login
        </Title>

        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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
            <Input
              prefix={<MailOutlined />}
              placeholder="admin@gmail.com"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your password",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Login
          </Button>
        </Form>

        <div
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Don't have an account?{" "}
          <Link to={ROUTES.REGISTER}>
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;