import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          localStorage.getItem("token") ? (
            <Navigate to="/" replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Alias */}
      <Route
        path="/dashboard"
        element={<Navigate to="/" replace />}
      />

      {/* 404 */}
      <Route
        path="/404"
        element={<NotFound />}
      />

      {/* Unknown Routes */}
      <Route
        path="*"
        element={<Navigate to="/404" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;