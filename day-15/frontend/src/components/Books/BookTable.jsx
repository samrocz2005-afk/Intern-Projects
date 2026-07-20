// src/components/Books/BookTable.jsx

import React from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { ROLES } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";

const BookTable = ({
  books = [],
  loading = false,
  pagination,
  onTableChange,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();

  const canManageBooks =
    user?.role === ROLES.ADMIN ||
    user?.role === ROLES.MEMBER;

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
  ];

  if (canManageBooks) {
    columns.push({
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete this book?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record._id)}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    });
  }

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={books}
      loading={loading}
      pagination={pagination}
      onChange={onTableChange}
    />
  );
};

export default BookTable;