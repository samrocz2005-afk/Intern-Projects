import { Form, Input, Card, Typography, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/axios";
import { SignupSubmitButton } from "../utils/buttons";

const { Title } = Typography;

function Signup() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await api.post("/auth/signup", values);

      message.success("Signup Successful!");
      navigate("/");
    } catch (err) {
      const errorData = err.response?.data;

      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors
          .map((e) => e.msg)
          .join(", ");

        message.error(errorMessages);
      } else {
        message.error(
          errorData?.message || "Signup failed. Please try again."
        );
      }
    }
  };

  return (
    <Card style={{ width: 400, margin: "50px auto" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
        Signup
      </Title>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter your name!",
            },
          ]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email!",
            },
            {
              type: "email",
              message: "Please enter a valid email!",
            },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          extra={
            <span style={{ color: "#ff4d4f" }}>
              At least 8 characters, 1 uppercase letter and 1 special character
              (!@#$%^&*)
            </span>
          }
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
            {
              pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
              message:
                "Password must be at least 8 characters and include one uppercase letter and one special character.",
            },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <SignupSubmitButton />
      </Form>

      <p style={{ marginTop: 20, textAlign: "center" }}>
        Already have an account? <Link to="/">Login</Link>
      </p>
    </Card>
  );
}

export default Signup;