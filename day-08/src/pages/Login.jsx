import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Card, Form, Input, Button, Alert, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";
import { validateLogin } from "../utils/validation";

const { Title } = Typography;

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    const validationErrors = validateLogin(email, password);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      const result = await loginUser(email, password);

      console.log("Login Result:", result);

      login(result.token);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setApiError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={2}>Login</Title>

        {apiError && (
          <Alert
            type="error"
            message={apiError}
            style={{ marginBottom: 20 }}
          />
        )}

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={errors.password ? "error" : ""}
            help={errors.password}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;