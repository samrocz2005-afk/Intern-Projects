import React from "react";
import { Navigate } from "react-router-dom";
import { Typography } from "antd";
import { useSelector } from "react-redux";

import LoginForm from "../components/auth/LoginForm";
import { selectIsAuthenticated } from "../features/auth/authSelectors";

const { Title } = Typography;

function Login() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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
      <div>
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          Student Task Management
        </Title>

        <LoginForm />
      </div>
    </div>
  );
}

export default Login;