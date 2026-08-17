import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  HeartFilled,
  SearchOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Breadcrumbs from "../../components/Breadcrumbs";
import useDebounce from "../../hooks/useDebounce";
import api from "../../services/axios";

const { Title, Text } = Typography;

function Wishlists() {
  const [search, setSearch] = useState("");
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const debouncedSearch = useDebounce(search, 500);

  // ==================================================
  // FETCH WISHLISTS FROM BACKEND (Server-side Pagination)
  // ==================================================
  const fetchWishlists = async (page = 1, limit = 5, searchKeyword = "") => {
    try {
      setLoading(true);
      const response = await api.get("/wishlists", {
        params: {
          page,
          limit,
          search: searchKeyword,
        },
      });

      const resData = response?.data;
      // Extract array directly from resData.data and pagination from top-level response
      const rawItems = Array.isArray(resData?.data) ? resData.data : [];
      const paginationData = resData?.pagination || {};

      const formatted = Array.isArray(rawItems)
        ? rawItems.map((item, index) => ({
            ...item,
            key: item._id || `${page}-${index}`,
            productName: item.productName || "Unknown Product",
            category: item.category || "General",
            price: item.price || 0,
            wishlistCount: item.wishlistCount || 1,
            customers: item.customers || 1,
            status: item.status || "In Stock",
            image: item.image,
          }))
        : [];

      setWishlistProducts(formatted);
      setPagination({
        current: paginationData.page || page,
        pageSize: paginationData.limit || limit,
        total: paginationData.total || formatted.length,
      });
    } catch (error) {
      console.error("Failed to load wishlists:", error);
      message.error(
        error.response?.data?.message || "Failed to load wishlist data"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page, pageSize, or debouncedSearch changes
  useEffect(() => {
    fetchWishlists(1, pagination.pageSize, debouncedSearch);
  }, [debouncedSearch]);

  // Handle Ant Design Table Pagination Change
  const handleTableChange = (newPagination) => {
    fetchWishlists(
      newPagination.current,
      newPagination.pageSize,
      debouncedSearch
    );
  };

  const totalWishlistCount = useMemo(() => {
    return Array.isArray(wishlistProducts)
      ? wishlistProducts.reduce(
          (total, product) => total + (Number(product.wishlistCount) || 0),
          0
        )
      : 0;
  }, [wishlistProducts]);

  const totalCustomers = useMemo(() => {
    return Array.isArray(wishlistProducts)
      ? wishlistProducts.reduce(
          (total, product) => total + (Number(product.customers) || 0),
          0
        )
      : 0;
  }, [wishlistProducts]);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
      case "Active":
        return "green";
      case "Low Stock":
        return "orange";
      case "Out of Stock":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Product",
      key: "product",
      render: (_, record) => (
        <Space>
          <Avatar
            shape="square"
            icon={<ShoppingOutlined />}
            src={record.image}
          />
          <div>
            <Text strong>{record.productName}</Text>
            <br />
            <Text type="secondary">{record.category}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${Number(price || 0).toLocaleString("en-IN")}`,
    },
    {
      title: "Wishlist Count",
      dataIndex: "wishlistCount",
      key: "wishlistCount",
      render: (count) => (
        <Space>
          <HeartFilled style={{ color: "#ff4d6d" }} />
          {count}
        </Space>
      ),
    },
    {
      title: "Customers",
      dataIndex: "customers",
      key: "customers",
      render: (customers) => (
        <Space>
          <UserOutlined />
          {customers}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
  ];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Marketing" },
          { label: "Wishlists" },
        ]}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Wishlists
          </Title>
          <Text type="secondary">
            View trending and most-wishlisted products.
          </Text>
        </div>

        <Input
          allowClear
          placeholder="Search products"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ width: 240 }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <HeartFilled
              style={{
                fontSize: "28px",
                color: "#ff4d6d",
              }}
            />
            <div>
              <Text type="secondary">Total Wishlist Items</Text>
              <Title level={3} style={{ margin: 0 }}>
                {totalWishlistCount}
              </Title>
            </div>
          </div>
        </Card>

        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <UserOutlined
              style={{
                fontSize: "28px",
                color: "#1677ff",
              }}
            />
            <div>
              <Text type="secondary">Interested Customers</Text>
              <Title level={3} style={{ margin: 0 }}>
                {totalCustomers}
              </Title>
            </div>
          </div>
        </Card>

        <Card>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <ShoppingOutlined
              style={{
                fontSize: "28px",
                color: "#52c41a",
              }}
            />
            <div>
              <Text type="secondary">Trending Products</Text>
              <Title level={3} style={{ margin: 0 }}>
                {pagination.total}
              </Title>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Most-Wishlisted Products">
        <Table
          rowKey={(record) => record.key}
          columns={columns}
          dataSource={wishlistProducts}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50"],
          }}
          onChange={handleTableChange}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}

export default Wishlists;