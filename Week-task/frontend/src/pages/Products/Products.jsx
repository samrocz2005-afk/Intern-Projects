import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
  Modal,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";

import useDebounce from "../../hooks/useDebounce";

import {
  getProducts,
  deleteProduct,
} from "../../services/productApi";

const { Title } = Typography;

function Products() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Get current user role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role ? user.role.toLowerCase() : "customer";
  const isAdminOrManager = ["admin", "manager"].includes(userRole);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const debouncedSearch = useDebounce(search, 500);

  const loadProducts = useCallback(
    async (page = 1, pageSize = 5) => {
      try {
        setLoading(true);

        const response = await getProducts({
          page,
          limit: pageSize,
          search: debouncedSearch.trim(),
        });

        setProducts(response.data || []);

        setPagination({
          current: response.pagination?.page || page,
          pageSize: response.pagination?.limit || pageSize,
          total: response.pagination?.total || 0,
        });
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch]
  );

  useEffect(() => {
    loadProducts(1, pagination.pageSize);
  }, [
    debouncedSearch,
    loadProducts,
    pagination.pageSize,
  ]);

  const handleTableChange = (paginationData) => {
    loadProducts(
      paginationData.current,
      paginationData.pageSize
    );
  };

  const showDeleteModal = (product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    const id = productToDelete._id;

    try {
      setDeletingId(id);

      await deleteProduct(id);

      message.success("Product deleted successfully");

      setDeleteModalVisible(false);
      setProductToDelete(null);

      const isLastItemOnPage =
        products.length === 1 &&
        pagination.current > 1;

      const nextPage = isLastItemOnPage
        ? pagination.current - 1
        : pagination.current;

      await loadProducts(
        nextPage,
        pagination.pageSize
      );
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to delete product"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleBuy = (product) => {
    navigate("/orders/checkout", {
      state: { product },
    });
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Category",
      dataIndex: "category",
      key: "category",

      render: (category) => {
        if (!category) {
          return "N/A";
        }

        if (typeof category === "object") {
          return category.name || "N/A";
        }

        return category;
      },
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",

      render: (price) =>
        `₹${Number(price || 0).toLocaleString("en-IN")}`,
    },

    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",

      render: (stock) => (
        <Tag color={stock > 0 ? "green" : "red"}>
          {stock > 0
            ? `${stock} Available`
            : "Out of Stock"}
        </Tag>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status) => (
        <Tag
          color={
            status === "Active"
              ? "green"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },

    {
      title: "Action",
      key: "action",

      render: (_, record) => (
        <Space>
          {isAdminOrManager ? (
            <>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() =>
                  navigate(
                    `/products/all-products/edit/${record._id}`
                  )
                }
              >
                Edit
              </Button>

              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                loading={deletingId === record._id}
                onClick={() =>
                  showDeleteModal(record)
                }
              >
                Delete
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              size="small"
              icon={<ShoppingCartOutlined />}
              disabled={
                record.stock <= 0 ||
                record.status !== "Active"
              }
              onClick={() => handleBuy(record)}
            >
              Buy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      {/* Global Breadcrumb */}
      <Breadcrumbs />

      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <Title
          level={3}
          style={{
            margin: 0,
          }}
        >
          {isAdminOrManager
            ? "Products Management"
            : "Browse Products"}
        </Title>

        <Space wrap>
          <Input
            allowClear
            placeholder="Search products"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            style={{
              width: 240,
            }}
          />

          {isAdminOrManager && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate("/products/all-products/add-product")
              }
            >
              Add Product
            </Button>
          )}
        </Space>
      </div>

      {/* Products Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={products}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
        scroll={{
          x: "max-content",
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined
              style={{ color: "#faad14" }}
            />
            <span>Delete product</span>
          </Space>
        }
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        okText="Yes"
        okButtonProps={{
          danger: true,
          loading: deletingId !== null,
        }}
        cancelText="No"
        onCancel={() => {
          setDeleteModalVisible(false);
          setProductToDelete(null);
        }}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{productToDelete?.name}</strong>?
        </p>
      </Modal>
    </Card>
  );
}

export default Products;