import { useState } from "react";
import {
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
} from "@ant-design/icons";
import {
  useNavigate,
  Link,
} from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../services/authApi";
import { loginSuccess } from "../slices/authSlice";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const response = await login(values);

      const { token, user } = response.data.data;

      /*
       * Store authentication through Redux.
       * authSlice also persists token and user
       * to localStorage.
       */
      dispatch(
        loginSuccess({
          token,
          user,
        })
      );

      message.success("Login successful");

      // Dynamic redirect based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Title
          level={2}
          style={{
            textAlign: "center",
          }}
        >
          Login
        </Title>

        <Text
          type="secondary"
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Sign in to your Shopping Management account
        </Text>

        <Form
          layout="vertical"
          onFinish={handleSubmit}
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
              placeholder="Enter your email"
              size="large"
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
              placeholder="Enter your password"
              size="large"
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
              loading={loading}
              block
              size="large"
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{
            textAlign: "center",
          }}
        >
          <Text>
            Don't have an account?{" "}
          </Text>

          <Link to="/signup">
            Create account
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;