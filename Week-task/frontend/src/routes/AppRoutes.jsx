import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";

// Authentication
import Login from "../pages/Login";
import Signup from "../pages/Signup";

// Dashboards
import Dashboard from "../pages/Dashboard";
import CustomerDashboard from "../pages/CustomerDashboard";

// Products
import Products from "../pages/Products/Products";
import AddProduct from "../pages/Products/AddProduct";
import EditProduct from "../pages/Products/EditProduct";

// Categories
import Categories from "../pages/Categories/Categories";
import AddCategory from "../pages/Categories/AddCategory";

// Orders
import Orders from "../pages/Orders/Orders";
import PendingOrders from "../pages/Orders/PendingOrders";
import CompletedOrders from "../pages/Orders/CompletedOrders";
import OrderDetails from "../pages/Orders/OrderDetails";
import CreateOrder from "../pages/Orders/Checkout";

// Settings
import Settings from "../pages/Settings/Settings";
import Profile from "../pages/Settings/Profile";

// Customers
import Customers from "../pages/Customers/Customers";
import CustomerDetails from "../pages/Customers/CustomerDetails";

// Operations
import Analytics from "../pages/Operations/Analytics";
import Inventory from "../pages/Operations/Inventory";
import Discounts from "../pages/Operations/Discounts";
import Transactions from "../pages/Operations/Transactions";
import Coupon from "../pages/Operations/AddCoupon";

// Marketing
import Reviews from "../pages/Marketing/Reviews";
import Campaigns from "../pages/Marketing/Campaigns";
import Wishlists from "../pages/Marketing/Wishlists";

// Administration
import Vendors from "../pages/Administration/Vendors";
import StaffPermissions from "../pages/Administration/StaffPermissions";
import Integrations from "../pages/Administration/Integrations";
import HelpSupport from "../pages/Administration/HelpSupport";

// Shipping
import ShippingDelivery from "../pages/Shipping/ShippingDelivery";
import ShippingDeliveryDetails from "../pages/Shipping/ShippingDeliveryDetails"

// Returns
import ReturnsRefunds from "../pages/Returns/ReturnsRefunds";
import RefundDetails from "../pages/Returns/RefundDetails";
import CreateReturn from "../pages/Returns/CreateReturn";

// Activity
import ActivityLogs from "../pages/Activity/ActivityLogs";
import ActivityLogDetails from "../pages/Activity/ActivityLogDetails";

// Notifications
import Notifications from "../pages/Notifications/Notifications";
import NotificationDetails from "../pages/Notifications/NotificationDetails";

// Helper component to render the appropriate dashboard based on user role
const RoleBasedDashboard = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (user?.role === "admin") {
    return <Dashboard />;
  }

  return <CustomerDashboard />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* ==================================================
          PUBLIC AUTHENTICATION ROUTES
          ================================================== */}

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ==================================================
          PROTECTED APPLICATION ROUTES
          ================================================== */}

      <Route element={<ProtectedRoute />}>
        {/* ==================== DASHBOARD ==================== */}

        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <RoleBasedDashboard />
            </AppLayout>
          }
        />

        {/* ==================== PRODUCTS ==================== */}

        <Route
          path="/products/all-products"
          element={
            <AppLayout>
              <Products />
            </AppLayout>
          }
        />

        <Route
          path="/products/all-products/add-product"
          element={
            <AppLayout>
              <AddProduct />
            </AppLayout>
          }
        />

        <Route
          path="/products/all-products/edit/:id"
          element={
            <AppLayout>
              <EditProduct />
            </AppLayout>
          }
        />

        {/* Old Products URL → New Products URL */}
        <Route
          path="/products"
          element={<Navigate to="/products/all-products" replace />}
        />

        {/* ==================== CATEGORIES ==================== */}

        <Route
          path="/products/categories"
          element={
            <AppLayout>
              <Categories />
            </AppLayout>
          }
        />

        <Route
          path="/products/categories/add-categories"
          element={
            <AppLayout>
              <AddCategory />
            </AppLayout>
          }
        />

        {/* ==================== ORDERS ==================== */}

        <Route
          path="/orders/all-orders"
          element={
            <AppLayout>
              <Orders />
            </AppLayout>
          }
        />

        <Route
          path="/orders/pending"
          element={
            <AppLayout>
              <PendingOrders />
            </AppLayout>
          }
        />
        <Route
            path="/orders/pending/:id"
            element={
            <AppLayout>
                <OrderDetails />
            </AppLayout>}
        />

        <Route
          path="/orders/completed"
          element={
            <AppLayout>
              <CompletedOrders />
            </AppLayout>
          }
        />
        <Route
            path="/orders/completed/:id"
            element={
            <AppLayout>
                <OrderDetails />
            </AppLayout>}
        />

        <Route
          path="/orders/checkout"
          element={
            <AppLayout>
              <CreateOrder />
            </AppLayout>
          }
        />

        <Route
          path="/orders/all-orders/:id"
          element={
            <AppLayout>
              <OrderDetails />
            </AppLayout>
          }
        />

        {/* Old Orders URL → New Orders URL */}
        <Route
          path="/orders"
          element={<Navigate to="/orders/all-orders" replace />}
        />

        {/* ==================== CUSTOMERS ==================== */}

        <Route
          path="/customers/all-customers"
          element={
            <AppLayout>
              <Customers />
            </AppLayout>
          }
        />

        <Route
          path="/customers/:id"
          element={
            <AppLayout>
              <CustomerDetails />
            </AppLayout>
          }
        />

        {/* Old Customers URL → New Customers URL */}
        <Route
          path="/customers"
          element={<Navigate to="/customers/all-customers" replace />}
        />

        {/* ==================== OPERATIONS ==================== */}

        <Route
          path="/Operations&Sales/analytics"
          element={
            <AppLayout>
              <Analytics />
            </AppLayout>
          }
        />

        <Route
          path="/Operations&Sales/inventory"
          element={
            <AppLayout>
              <Inventory />
            </AppLayout>
          }
        />

        <Route
          path="/Operations&Sales/discounts"
          element={
            <AppLayout>
              <Discounts />
            </AppLayout>
          }
        />

        <Route
          path="/Operations&Sales/transactions"
          element={
            <AppLayout>
              <Transactions />
            </AppLayout>
          }
        />

        <Route
          path="/Operations&Sales/discounts/add-coupon"
          element={
            <AppLayout>
              <Coupon />
            </AppLayout>
          }
        />

        {/* ==================== MARKETING ==================== */}

        <Route
          path="/Marketing/reviews"
          element={
            <AppLayout>
              <Reviews />
            </AppLayout>
          }
        />

        <Route
          path="/Marketing/campaigns"
          element={
            <AppLayout>
              <Campaigns />
            </AppLayout>
          }
        />

        <Route
          path="/Marketing/wishlists"
          element={
            <AppLayout>
              <Wishlists />
            </AppLayout>
          }
        />

        {/* ==================== ADMINISTRATION ==================== */}

        <Route
          path="/Administration/vendors"
          element={
            <AppLayout>
              <Vendors />
            </AppLayout>
          }
        />

        <Route
          path="/Administration/staff-permissions"
          element={
            <AppLayout>
              <StaffPermissions />
            </AppLayout>
          }
        />

        <Route
          path="/Administration/integrations"
          element={
            <AppLayout>
              <Integrations />
            </AppLayout>
          }
        />

        <Route
          path="/Administration/help-support"
          element={
            <AppLayout>
              <HelpSupport />
            </AppLayout>
          }
        />

        {/* ==================== SHIPPING ==================== */}

        <Route
          path="/shipping"
          element={
            <AppLayout>
              <ShippingDelivery />
            </AppLayout>
          }
        />

        <Route
          path="/shipping/:shipmentId"
          element={
            <AppLayout>
              <ShippingDeliveryDetails />
            </AppLayout>
          }
        />

        {/* ==================== RETURNS ==================== */}

        <Route
          path="/returns"
          element={
            <AppLayout>
              <ReturnsRefunds />
            </AppLayout>
          }
        />

        <Route
          path="/returns/Create-Return"
          element={
            <AppLayout>
              <CreateReturn />
            </AppLayout>
          }
        />

        <Route
          path="/returns/:id"
          element={
            <AppLayout>
              <RefundDetails />
            </AppLayout>
          }
        />

        {/* ==================== ACTIVITY LOGS ==================== */}

        <Route
          path="/activity-logs"
          element={
            <AppLayout>
              <ActivityLogs />
            </AppLayout>
          }
        />


        <Route
          path="/activity-logs/:activityId"
          element={
          <AppLayout>
            <ActivityLogDetails />
          </AppLayout>
            }
        />

        {/* ==================== NOTIFICATIONS ==================== */}

        <Route
          path="/notifications"
          element={
            <AppLayout>
              <Notifications />
            </AppLayout>
          }
        />

        <Route
          path="/notifications/:id"
          element={
            <AppLayout>
              <NotificationDetails/>
            </AppLayout>
          }
        />

        {/* ==================== SETTINGS ==================== */}

        <Route
          path="/settings/general"
          element={
            <AppLayout>
              <Settings />
            </AppLayout>
          }
        />

        <Route
          path="/settings/profile"
          element={
            <AppLayout>
              <Profile />
            </AppLayout>
          }
        />
      </Route>

      {/* ==================================================
          DEFAULT ROUTES
          ================================================== */}

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;