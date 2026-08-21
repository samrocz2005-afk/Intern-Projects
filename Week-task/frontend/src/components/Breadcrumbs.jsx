import React from "react";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

function Breadcrumbs() {
  const location = useLocation();
  const pathname = location.pathname;

  const pathSegments = pathname.split("/").filter(Boolean);

  const getLabel = (segment) => {
    const labels = {
      products: "Products",
      "all-products": "All Products",
      categories: "Categories",
      orders: "Orders",
      pending: "Pending Orders",
      completed: "Completed Orders",
      customers: "Customers",
      returns: "Returns & Refunds",
      edit: "Edit",
      add: "Add",
      checkout: "Checkout",
      dashboard: "Dashboard",
    };

    return (
      labels[segment] ||
      segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    );
  };

  const getBreadcrumbItems = () => {
    const items = [
      {
        title: (
          <Link to="/">
            <HomeOutlined />
          </Link>
        ),
      },
    ];

    let currentPath = "";

    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      const isLast = index === pathSegments.length - 1;

      items.push({
        title: isLast ? (
          <span>{getLabel(segment)}</span>
        ) : (
          <span
            style={{
              color: "rgba(0, 0, 0, 0.45)",
              cursor: "default",
            }}
          >
            {getLabel(segment)}
          </span>
        ),
      });
    });

    return items;
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <Breadcrumb
        separator="/"
        items={getBreadcrumbItems()}
      />
    </div>
  );
}

export default Breadcrumbs;