import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

import useBreadcrumb from "../../hooks/useBreadcrumb";

const GlobalBreadcrumb = () => {
  const { breadcrumbs = [] } = useBreadcrumb();

  if (breadcrumbs.length === 0) {
    return null;
  }

  const items = breadcrumbs.map((item, index) => {
    const isLast =
      index === breadcrumbs.length - 1;

    const title = item.title || item.label || "";

    return {
      key:
        item.key ||
        item.path ||
        `${title}-${index}`,

      title:
        item.path && !isLast ? (
          <Link to={item.path}>
            {title}
          </Link>
        ) : (
          title
        ),
    };
  });

  return (
    <Breadcrumb
      items={items}
      style={{
        marginBottom: 16,
      }}
    />
  );
};

export default GlobalBreadcrumb;