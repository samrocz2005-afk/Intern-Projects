import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";

import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  SettingOutlined,

  // Products
  UnorderedListOutlined,
  TagsOutlined,

  // Orders
  ClockCircleOutlined,
  CheckCircleOutlined,

  // Customers
  UserOutlined,

  // Settings
  ToolOutlined,

  // Operations
  BarChartOutlined,
  InboxOutlined,
  PercentageOutlined,
  CreditCardOutlined,

  // Marketing
  StarOutlined,
  NotificationOutlined,
  HeartOutlined,

  // Administration
  ShopOutlined,
  SafetyOutlined,
  ApiOutlined,
  CustomerServiceOutlined,

  // Single menu items
  TruckOutlined,
  RollbackOutlined,
  HistoryOutlined,
  BellOutlined,
} from "@ant-design/icons";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const { Sider } = Layout;

/*
|--------------------------------------------------------------------------
| Sidebar Menu Items
|--------------------------------------------------------------------------
*/

const menuItems = [
  // ==================================================
  // DASHBOARD
  // ==================================================
  {
    key: "/dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },

  // ==================================================
  // PRODUCTS
  // ==================================================
  {
    key: "products",
    icon: <ShoppingOutlined />,
    label: "Products",
    children: [
      {
        key: "/products",
        icon: <UnorderedListOutlined />,
        label: "All Products",
      },
      {
        key: "/products/categories",
        icon: <TagsOutlined />,
        label: "Categories",
        adminOnly: true,
      },
    ],
  },

  // ==================================================
  // ORDERS
  // ==================================================
  {
    key: "orders",
    icon: <ShoppingCartOutlined />,
    label: "Orders",
    children: [
      {
        key: "/orders",
        icon: <UnorderedListOutlined />,
        label: "All Orders",
      },
      {
        key: "/orders/pending",
        icon: <ClockCircleOutlined />,
        label: "Pending Orders",
        adminOnly: true,
      },
      {
        key: "/orders/completed",
        icon: <CheckCircleOutlined />,
        label: "Completed Orders",
        adminOnly: true,
      },
    ],
  },

  // ==================================================
  // CUSTOMERS
  // ==================================================
  {
    key: "customers",
    icon: <TeamOutlined />,
    label: "Customers",
    adminOnly: true,
    children: [
      {
        key: "/customers",
        icon: <UserOutlined />,
        label: "All Customers",
      },
    ],
  },

  // ==================================================
  // OPERATIONS & SALES
  // ==================================================
  {
    key: "operations",
    icon: <BarChartOutlined />,
    label: "Operations & Sales",
    adminOnly: true,
    children: [
      {
        key: "/Operations&Sales/analytics",
        icon: <BarChartOutlined />,
        label: "Analytics & Reports",
      },
      {
        key: "/Operations&Sales/inventory",
        icon: <InboxOutlined />,
        label: "Inventory / Stock",
      },
      {
        key: "/Operations&Sales/discounts",
        icon: <PercentageOutlined />,
        label: "Discounts & Coupons",
      },
      {
        key: "/Operations&Sales/transactions",
        icon: <CreditCardOutlined />,
        label: "Transactions / Payments",
      },
    ],
  },

  // ==================================================
  // MARKETING
  // ==================================================
  {
    key: "Marketing",
    icon: <NotificationOutlined />,
    label: "Marketing",
    children: [
      {
        key: "/Marketing/reviews",
        icon: <StarOutlined />,
        label: "Reviews & Ratings",
        adminOnly: true,
      },
      {
        key: "/Marketing/campaigns",
        icon: <NotificationOutlined />,
        label: "Marketing Campaigns",
        adminOnly: true,
      },
      {
        key: "/Marketing/wishlists",
        icon: <HeartOutlined />,
        label: "Wishlists",
      },
    ],
  },

  // ==================================================
  // ADMINISTRATION
  // ==================================================
  {
    key: "Administration",
    icon: <SafetyOutlined />,
    label: "Administration",
    adminOnly: true,
    children: [
      {
        key: "/Administration/vendors",
        icon: <ShopOutlined />,
        label: "Vendors / Sellers",
      },
      {
        key: "/Administration/staff-permissions",
        icon: <SafetyOutlined />,
        label: "Staff & Permissions",
      },
      {
        key: "/Administration/integrations",
        icon: <ApiOutlined />,
        label: "Integrations",
      },
      {
        key: "/Administration/help-support",
        icon: <CustomerServiceOutlined />,
        label: "Help & Support",
      },
    ],
  },

  // ==================================================
  // SHIPPING
  // ==================================================
  {
    key: "/shipping",
    icon: <TruckOutlined />,
    label: "Shipping & Delivery",
    adminOnly: true,
  },

  // ==================================================
  // RETURNS
  // ==================================================
  {
    key: "/returns",
    icon: <RollbackOutlined />,
    label: "Returns & Refunds",
    adminOnly: true,
  },

  // ==================================================
  // ACTIVITY LOGS
  // ==================================================
  {
    key: "/activity-logs",
    icon: <HistoryOutlined />,
    label: "Activity Logs",
    adminOnly: true,
  },

  // ==================================================
  // NOTIFICATIONS
  // ==================================================
  {
    key: "/notifications",
    icon: <BellOutlined />,
    label: "Notifications",
  },

  // ==================================================
  // SETTINGS
  // ==================================================
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Settings",
    children: [
      {
        key: "/settings/general",
        icon: <ToolOutlined />,
        label: "General",
        adminOnly: true,
      },
      {
        key: "/settings/profile",
        icon: <UserOutlined />,
        label: "Profile",
      },
    ],
  },
];

/*
|--------------------------------------------------------------------------
| Sidebar Component
|--------------------------------------------------------------------------
*/

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [openKeys, setOpenKeys] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);

  /*
  |--------------------------------------------------------------------------
  | Filter Menu Based On User Role
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const userString = localStorage.getItem("user");

    let user = null;

    try {
      user = userString
        ? JSON.parse(userString)
        : null;
    } catch {
      user = null;
    }

    /*
     * Support both:
     *
     * "admin"
     * "Admin"
     */
    const role = String(user?.role || "").toLowerCase();

    const isAdmin = role === "admin";

    const filterItems = (items) => {
      return items
        .filter((item) => {
          if (item.adminOnly && !isAdmin) {
            return false;
          }

          return true;
        })
        .map((item) => {
          if (!item.children) {
            return item;
          }

          const filteredChildren =
            item.children.filter((child) => {
              if (child.adminOnly && !isAdmin) {
                return false;
              }

              return true;
            });

          if (filteredChildren.length === 0) {
            return null;
          }

          return {
            ...item,
            children: filteredChildren,
          };
        })
        .filter(Boolean);
    };

    setFilteredMenuItems(
      filterItems(menuItems)
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Automatically Open Parent Menu
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!filteredMenuItems.length) {
      return;
    }

    const pathname = location.pathname;

    for (const item of filteredMenuItems) {
      if (!item.children) {
        continue;
      }

      const matchingChild =
        item.children.find((child) => {
          return (
            pathname === child.key ||
            pathname.startsWith(`${child.key}/`)
          );
        });

      if (matchingChild) {
        setOpenKeys([item.key]);
        return;
      }
    }

    setOpenKeys([]);
  }, [
    location.pathname,
    filteredMenuItems,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Menu Click
  |--------------------------------------------------------------------------
  */

  const handleMenuClick = ({ key }) => {
    /*
     * Parent menu keys are:
     *
     * products
     * orders
     * customers
     * etc.
     *
     * Only navigate for actual route keys.
     */
    if (key.startsWith("/")) {
      navigate(key);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Keep Only One Parent Open
  |--------------------------------------------------------------------------
  */

  const handleOpenChange = (keys) => {
    const latestOpenKey = keys.find(
      (key) => !openKeys.includes(key)
    );

    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys(keys);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Get All Actual Route Items
  |--------------------------------------------------------------------------
  */

  const getRouteItems = () => {
    return filteredMenuItems.flatMap((item) => {
      if (item.children) {
        return item.children;
      }

      return [item];
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Determine Selected Sidebar Item
  |--------------------------------------------------------------------------
  */

  const getSelectedKey = () => {
    const pathname = location.pathname;

    /*
     * ==================================================
     * ORDER DETAILS
     * ==================================================
     *
     * /orders/:id
     *             -> All Orders
     *
     * /orders/pending/:id
     *             -> Pending Orders
     *
     * /orders/completed/:id
     *             -> Completed Orders
     *
     * This is based ONLY on the URL.
     * No location.state required.
     */

    if (
      pathname.startsWith("/orders/pending/")
    ) {
      return "/orders/pending";
    }

    if (
      pathname.startsWith("/orders/completed/")
    ) {
      return "/orders/completed";
    }

    /*
     * IMPORTANT:
     *
     * /orders/123
     *
     * must select All Orders.
     */
    if (
      pathname.startsWith("/orders/") &&
      pathname !== "/orders/pending" &&
      pathname !== "/orders/completed"
    ) {
      return "/orders";
    }

    /*
     * ==================================================
     * NORMAL ROUTES
     * ==================================================
     */

    const routeItems = getRouteItems();

    /*
     * Find every matching route.
     *
     * Example:
     *
     * /products
     * /products/categories
     *
     * URL:
     * /products/categories
     *
     * Both could potentially match using startsWith.
     * Therefore we select the LONGEST matching route.
     */

    const matchedItem = routeItems
      .filter((item) => {
        if (!item.key?.startsWith("/")) {
          return false;
        }

        return (
          pathname === item.key ||
          pathname.startsWith(`${item.key}/`)
        );
      })
      .sort(
        (a, b) =>
          b.key.length - a.key.length
      )[0];

    return matchedItem?.key || null;
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <Sider
      width={240}
      theme="dark"
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        minHeight: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontSize: "20px",
          fontWeight: 600,
          borderBottom:
            "1px solid rgba(255,255,255,0.1)",
        }}
      >
        Shopping App
      </div>

      {/* Sidebar Menu */}
      <Menu
        theme="dark"
        mode="inline"
        items={filteredMenuItems}
        openKeys={openKeys}
        selectedKeys={
          getSelectedKey()
            ? [getSelectedKey()]
            : []
        }
        onOpenChange={handleOpenChange}
        onClick={handleMenuClick}
        style={{
          borderRight: 0,
          marginTop: "8px",
        }}
      />
    </Sider>
  );
}

export default Sidebar;