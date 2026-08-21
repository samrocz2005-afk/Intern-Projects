import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Loading from "../components/common/Loading";
import { selectAuthLoading } from "../redux/selectors/resourceSelectors";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const user = useSelector(
    (state) => state.auth?.user
  );

  const token = useSelector(
    (state) => state.auth?.token
  );

  const loading = useSelector(
    selectAuthLoading
  );

  /*
   * While authentication state is being
   * restored from localStorage/API.
   */
  if (loading) {
    return (
      <Loading
        fullScreen
        tip="Checking authentication..."
      />
    );
  }

  /*
   * User is not authenticated.
   *
   * Redirect to login and preserve the
   * requested location.
   */
  if (!user || !token) {
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
   * Supports both:
   *
   * <ProtectedRoute>
   *   <Page />
   * </ProtectedRoute>
   *
   * and:
   *
   * <ProtectedRoute />
   * <Outlet />
   */
  return children || <Outlet />;
};

export default ProtectedRoute;