import React, {
  useEffect,
  useState,
  useCallback,
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
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { useNavigate } from "react-router-dom";

import {
  getCategories,
  deleteCategory,
} from "../../services/categoryApi";

import Breadcrumbs from "../../components/Breadcrumbs";

const { Title } = Typography;

function Categories() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  /*
   * --------------------------------------------------
   * Fetch Categories
   * --------------------------------------------------
   */

  const fetchCategories = useCallback(
    async (
      page = 1,
      limit = 5,
      searchTerm = ""
    ) => {
      try {
        setLoading(true);

        const response = await getCategories({
          page,
          limit,
          search: searchTerm.trim(),
        });

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        const paginationData =
          response?.pagination || {};

        setCategories(
          data.map((item) => ({
            ...item,
            key: item._id,
          }))
        );

        setPagination((prev) => ({
          ...prev,
          current:
            paginationData.page || page,
          pageSize:
            paginationData.limit || limit,
          total:
            paginationData.total ?? data.length,
        }));
      } catch (error) {
        message.error(
          error.response?.data?.message ||
            "Failed to load categories"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /*
   * --------------------------------------------------
   * Initial / Search / Pagination Fetch
   * --------------------------------------------------
   */

  const { current, pageSize } = pagination;

  useEffect(() => {
    fetchCategories(
      current,
      pageSize,
      search
    );
  }, [
    fetchCategories,
    current,
    pageSize,
    search,
  ]);

  /*
   * --------------------------------------------------
   * Table Pagination
   * --------------------------------------------------
   */

  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  /*
   * --------------------------------------------------
   * Delete Category
   * --------------------------------------------------
   */

  const handleDelete = (category) => {
    Modal.confirm({
      title:
        "Are you sure you want to delete this category?",

      icon: <ExclamationCircleOutlined />,

      content: `This action will delete "${category.name}".`,

      okText: "Yes, Delete",

      okType: "danger",

      cancelText: "Cancel",

      onOk: async () => {
        try {
          await deleteCategory(category._id);

          message.success(
            "Category deleted successfully"
          );

          const isLastItemOnPage =
            categories.length === 1 &&
            pagination.current > 1;

          const nextPage = isLastItemOnPage
            ? pagination.current - 1
            : pagination.current;

          setPagination((prev) => ({
            ...prev,
            current: nextPage,
          }));
        } catch (error) {
          message.error(
            error.response?.data?.message ||
              "Failed to delete category"
          );
        }
      },
    });
  };

  /*
   * --------------------------------------------------
   * Table Columns
   * --------------------------------------------------
   */

  const columns = [
    {
      title: "Category",
      dataIndex: "name",
      key: "name",
      render: (name) => name || "N/A",
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) =>
        description || "N/A",
    },

    {
      title: "Products",
      dataIndex: "productCount",
      key: "productCount",
      render: (count) => count ?? 0,
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
          {status || "Active"}
        </Tag>
      ),
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() =>
              handleDelete(record)
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  /*
   * --------------------------------------------------
   * UI
   * --------------------------------------------------
   */

  return (
    <>
      {/* Breadcrumbs are generated automatically from URL */}
      <Breadcrumbs />

      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <Title
            level={3}
            style={{ margin: 0 }}
          >
            Categories
          </Title>

          <Space wrap>
            <Input
              allowClear
              placeholder="Search categories"
              prefix={<SearchOutlined />}
              value={search}
              onChange={(event) => {
                const value =
                  event.target.value;

                setSearch(value);

                setPagination((prev) => ({
                  ...prev,
                  current: 1,
                }));
              }}
              style={{ width: 240 }}
            />

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                navigate("/products/categories/add-categories")
              }
            >
              Add Category
            </Button>
          </Space>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={categories}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: [
              "5",
              "10",
              "20",
              "50",
            ],
          }}
          onChange={handleTableChange}
          scroll={{
            x: "max-content",
          }}
        />
      </Card>
    </>
  );
}

export default Categories;