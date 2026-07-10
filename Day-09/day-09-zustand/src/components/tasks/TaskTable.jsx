import React from "react";
import { Table, Tag, Button, Space } from "antd";

function TaskTable({
  tasks,
  onEdit,
  onDelete,
}) {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority) => (
        <Tag
          color={
            priority === "High"
              ? "red"
              : priority === "Medium"
              ? "gold"
              : "green"
          }
        >
          {priority}
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
            status === "Completed"
              ? "green"
              : status === "In Progress"
              ? "blue"
              : "orange"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>

          <Button
            danger
            onClick={() => onDelete(record.id || record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey={(record) => record.id || record._id}
      columns={columns}
      dataSource={tasks}
      pagination={{
        defaultPageSize: 5,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 15], // Numbers are preferred here by Ant Design
      }}
    />
  );
}

export default TaskTable;