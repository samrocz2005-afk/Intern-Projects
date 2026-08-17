import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";

import ProtectedRoute from "../routes/ProtectedRoute";

const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Users = lazy(() => import("../pages/Users"));
const Cinemas = lazy(() => import("../pages/Cinemas"));

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cinemas"
          element={
            <ProtectedRoute>
              <Cinemas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute role="Admin">
              <Users />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;