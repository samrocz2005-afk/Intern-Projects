import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminRoute({ children }) {
  const { token, user } = useSelector((state) => state.auth);

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Logged in but not an admin
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default AdminRoute;