import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ROLES, ROUTES } from "../utils/constants";

// Layout
import AppLayout from "../components/Layout/AppLayout";
import ProtectedRoute from "../components/Layout/ProtectedRoute";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Books from "../pages/Books";
import Users from "../pages/Users";
import NotFound from "../pages/NotFound";


const AppRoutes = () => {

  return (

    <BrowserRouter>

      <Routes>


        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to={ROUTES.LOGIN}
              replace
            />
          }
        />



        {/* Public Routes */}

        <Route
          path={ROUTES.LOGIN}
          element={<Login />}
        />


        <Route
          path={ROUTES.REGISTER}
          element={<Register />}
        />




        {/* Protected Routes */}

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >


          <Route
            path={ROUTES.DASHBOARD}
            element={<Dashboard />}
          />


          <Route
            path={ROUTES.BOOKS}
            element={<Books />}
          />



          {/* Admin Route */}

          <Route
            path={ROUTES.USERS}
            element={
              <ProtectedRoute
                roles={[
                  ROLES.ADMIN,
                ]}
              >
                <Users />
              </ProtectedRoute>
            }
          />


        </Route>





        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />


      </Routes>


    </BrowserRouter>

  );

};


export default AppRoutes;