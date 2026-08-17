import { useState } from "react";
import { Form, Input, Card, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import api from "../services/axios";
import { loginSuccess } from "../redux/authSlice";
import { LoginSubmitButton } from "../utils/buttons";

const { Title } = Typography;

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", values);

      const user = res.data.user;

      dispatch(
        loginSuccess({
          token: res.data.token,
          user: user,
        })
      );

      message.success("Login successful!");
      const userRolesArray = Array.isArray(user?.role)
        ? user.role.map((r) => (typeof r === "string" ? r.toLowerCase() : ""))
        : [typeof user?.role === "string" ? user.role.toLowerCase() : "reader"];

      const canViewMovies = userRolesArray.some((r) =>
        ["admin", "member", "movie read", "movie create", "movie update", "movie delete"].includes(r)
      );

      const canViewCinemas = userRolesArray.some((r) =>
        ["admin", "member", "cinema read", "cinema create", "cinema update", "cinema delete"].includes(r)
      );

      // Redirect user to their respective allowed initial home path
      if (canViewMovies) {
        navigate("/dashboard");
      } else if (canViewCinemas) {
        navigate("/cinemas");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: 400, margin: "80px auto" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Login
      </Title>

      <Form layout="vertical" onFinish={onFinish}>
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
              message: "Please enter a valid email address",
            },
          ]}
        >
          <Input placeholder="Enter your email" disabled={loading} />
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
          <Input.Password placeholder="Enter your password" disabled={loading} />
        </Form.Item>

        <LoginSubmitButton loading={loading} />
      </Form>

      <p style={{ marginTop: 20, textAlign: "center" }}>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </Card>
  );
}

export default Login;