import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, role }) {
  const { token, user } = useSelector((state) => state.auth);

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Normalize user.role to an array of lowercase strings
  const userRoles = Array.isArray(user?.role)
    ? user.role.map((r) => r.toLowerCase())
    : [user?.role?.toLowerCase()].filter(Boolean);

  // Role check using the array
  if (role && !userRoles.includes(role.toLowerCase())) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;