import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Result, Button } from "antd";

function RoleProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const { user } = useSelector((state) => state.auth);

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User doesn't have permission
  if (!allowedRoles.includes(user.role)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="You cannot access this page."
        extra={
          <Button
            type="primary"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        }
      />
    );
  }

  return children;
}

export default RoleProtectedRoute;