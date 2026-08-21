import React, {
  useMemo,
} from "react";

import {
  Layout,
  Menu,
} from "antd";

import {
  DashboardOutlined,
  CloudServerOutlined,
  GlobalOutlined,
  HddOutlined,
  NodeIndexOutlined,
  SwapOutlined,
  DollarOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const {
  Sider,
} = Layout;

const Sidebar = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    user,
  } = useAuth();

  /*
   * RBAC
   */
  const isAdmin =
    user?.role === "admin";

  const menuItems =
    useMemo(() => {
      const items = [
        {
          key: "/dashboard",
          icon: (
            <DashboardOutlined />
          ),
          label: "Dashboard",
        },

        {
          key: "/instances",
          icon: (
            <CloudServerOutlined />
          ),
          label: "Instances",
        },

        {
          key: "/networks",
          icon: (
            <GlobalOutlined />
          ),
          label: "Networks",
        },

        {
          key: "/storage",
          icon: (
            <HddOutlined />
          ),
          label: "Storage",
        },

        {
          key: "/routers",
          icon: (
            <NodeIndexOutlined />
          ),
          label: "Routers",
        },

        {
          key: "/load-balancers",
          icon: (
            <SwapOutlined />
          ),
          label: "Load Balancers",
        },

        {
          key: "/billing",
          icon: (
            <DollarOutlined />
          ),
          label: "Billing",
        },
      ];

      /*
       * Flavor management is
       * restricted to administrators.
       */
      if (isAdmin) {
        items.push({
          key: "/flavors",
          icon: (
            <SettingOutlined />
          ),
          label: "Flavors",
        });
      }

      return items;
    }, [isAdmin]);

  /*
   * Find active route.
   */
  const selectedKey =
    menuItems.find(
      (item) =>
        location.pathname ===
          item.key ||
        location.pathname.startsWith(
          `${item.key}/`
        )
    )?.key || "/dashboard";

  const handleMenuClick = ({
    key,
  }) => {
    navigate(key);
  };

  return (
    <Sider
      width={240}
      theme="dark"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          color: "#fff",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        Cloud Platform
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[
          selectedKey,
        ]}
        items={menuItems}
        onClick={
          handleMenuClick
        }
      />
    </Sider>
  );
};

export default Sidebar;