import React from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import InstanceList from "../pages/Instances/InstanceList";
import CreateInstance from "../pages/Instances/CreateInstance";
import InstanceDetails from "../pages/Instances/InstanceDetails";
import NetworkList from "../pages/Networks/NetworkList";
import CreateNetwork from "../pages/Networks/CreateNetwork";
import NetworkDetails from "../pages/Networks/NetworkDetails";
import StorageList from "../pages/Storage/StorageList";
import CreateStorage from "../pages/Storage/CreateStorage";
import StorageDetails from "../pages/Storage/StorageDetails";
import RouterList from "../pages/Routers/RouterList";
import CreateRouter from "../pages/Routers/CreateRouter";
import RouterDetails from "../pages/Routers/RouterDetails";
import LoadBalancerList from "../pages/LoadBalancers/LoadBalancerList";
import CreateLoadBalancer from "../pages/LoadBalancers/CreateLoadBalancer";
import LoadBalancerDetails from "../pages/LoadBalancers/LoadBalancerDetails";
import BillingOverview from "../pages/Billing/BillingOverview";
import Usage from "../pages/Billing/Usage";
import BillingHistory from "../pages/Billing/BillingHistory";
import Settings from "../pages/Settings/Settings";
import FlavorList from "../pages/Flavors/FlavorList";
import CreateFlavor from "../pages/Flavors/CreateFlavor";
import FlavorDetails from "../pages/Flavors/FlavorDetails";
import Profile from "../pages/Profile/Profile";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================================================================ */}
      {/* PUBLIC ROUTES                                                   */}
      {/* ================================================================ */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* ================================================================ */}
      {/* PROTECTED APPLICATION                                           */}
      {/* ================================================================ */}

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          {/* ------------------------------------------------------------ */}
          {/* DASHBOARD                                                    */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/profile"
            element={<Profile/>}
            />

          {/* ------------------------------------------------------------ */}
          {/* INSTANCES                                                    */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="/instances"
            element={<InstanceList />}
          />

          <Route
            path="/instances/create"
            element={<CreateInstance />}
          />

          <Route
            path="/instances/:id"
            element={<InstanceDetails />}
          />

          {/* ------------------------------------------------------------ */}
          {/* NETWORKS                                                     */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="/networks"
            element={<NetworkList />}
          />

          <Route
            path="/networks/create"
            element={<CreateNetwork />}
          />

          <Route
            path="/networks/:id"
            element={<NetworkDetails />}
          />

          {/* ------------------------------------------------------------ */}
          {/* STORAGE                                                      */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="/storage"
            element={<StorageList />}
          />

          <Route
            path="/storage/create"
            element={<CreateStorage />}
          />

          <Route
            path="/storage/:id"
            element={<StorageDetails />}
          />

          {/* ------------------------------------------------------------ */}
          {/* ROUTERS                                                      */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="/routers"
            element={<RouterList />}
          />

          <Route
            path="/routers/create"
            element={<CreateRouter />}
          />

          <Route
            path="/routers/:id"
            element={<RouterDetails />}
          />

          {/* ------------------------------------------------------------ */}
          {/* LOAD BALANCERS                                               */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="/load-balancers"
            element={<LoadBalancerList />}
          />

          <Route
            path="/load-balancers/create"
            element={<CreateLoadBalancer />}
          />

          <Route
            path="/load-balancers/:id"
            element={<LoadBalancerDetails />}
          />

          {/* ------------------------------------------------------------ */}
          {/* BILLING                                                      */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="/billing"
            element={<BillingOverview />}
          />

          <Route
            path="/billing/usage"
            element={<Usage />}
          />

          <Route
            path="/billing/history"
            element={<BillingHistory />}
          />

          {/* ------------------------------------------------------------ */}
          {/* Flavours                                                      */}
          {/* ------------------------------------------------------------ */}

         <Route
            element={
                <RoleRoute
                allowedRoles={["admin"]}
                />
            }
            >
            <Route
                path="/flavors"
                element={<FlavorList />}
            />

            <Route
                path="/flavors/create"
                element={<CreateFlavor />}
            />

            <Route
                path="/flavors/:id"
                element={<FlavorDetails />}
            />
        </Route>
            
          {/* ------------------------------------------------------------ */}
          {/* SETTINGS                                                     */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="/settings"
            element={<Settings />}
          />

          {/* ------------------------------------------------------------ */}
          {/* DEFAULT                                                      */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* ------------------------------------------------------------ */}
          {/* 404                                                          */}
          {/* ------------------------------------------------------------ */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Route>
      </Route>

    </Routes>
  );
};

export default AppRoutes;