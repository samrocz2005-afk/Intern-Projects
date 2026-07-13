import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { getRequest } from "../services/api";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    try {
      setLoading(true);

      const users = await getRequest("/users", {
        email: values.email.trim().toLowerCase(),
        password: values.password.trim(),
      });

      console.log("Users:", users);
      console.log(users);

      if (!Array.isArray(users) || users.length === 0) {
        message.error("Invalid email or password");
        return;
      }

      const user = users[0];

      localStorage.setItem("token", "kanban-token");
      localStorage.setItem("user", JSON.stringify(user));

      message.success("Login Successful");

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      message.error("Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#20212C",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 12,
          background: "#2B2C37",
          border: "none",
        }}
      >
        <Title
          level={2}
          style={{
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          Kanban
        </Title>

        <Text
          style={{
            color: "#828FA3",
            display: "block",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          Login to continue
        </Text>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label={<span style={{ color: "#fff" }}>Email</span>}
            rules={[
              {
                required: true,
                message: "Email is required",
              },
              {
                type: "email",
                message: "Enter a valid email",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: "#fff" }}>Password</span>}
            rules={[
              {
                required: true,
                message: "Password is required",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter password"
            />
          </Form.Item>

          <Button
            htmlType="submit"
            type="primary"
            block
            loading={loading}
            size="large"
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Login;