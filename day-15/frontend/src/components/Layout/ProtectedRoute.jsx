import React from "react";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../utils/constants";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // User not logged in
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Role check
  if (
    roles.length > 0 &&
    !roles.includes(user?.role)
  ) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;