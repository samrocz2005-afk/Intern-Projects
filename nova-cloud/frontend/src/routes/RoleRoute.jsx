import React from "react";
import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { Result, Button } from "antd";

import {
  selectUser,
} from "../redux/selectors/resourceSelectors";

const RoleRoute = ({
  allowedRoles = [],
  children,
}) => {
  const location = useLocation();

  const user = useSelector(selectUser);

  const userRole =
    user?.role?.toLowerCase();

  const normalizedRoles =
    allowedRoles.map((role) =>
      role.toLowerCase()
    );
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  /*
   * User does not have permission.
   */
  if (
    !normalizedRoles.includes(
      userRole
    )
  ) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="You do not have permission to access this page."
        extra={
          <Button
            type="primary"
            onClick={() => {
              window.history.back();
            }}
          >
            Go Back
          </Button>
        }
      />
    );
  }

  return children || <Outlet />;
};

export default RoleRoute;