import React from "react";
import { Table, Space, Button, Popconfirm, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";

import { removeTask } from "../../features/tasks/taskSlice";
import { selectTasks } from "../../features/tasks/taskSelectors";

function TaskList({ onEdit }) {
  const dispatch = useDispatch();

  const tasks = useSelector(selectTasks);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      render: (priority) => (
        <Tag color="blue">
          {priority}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "Completed"
              ? "green"
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
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>

          <Popconfirm
            title="Delete Task?"
            onConfirm={() =>
              dispatch(removeTask(record.id))
            }
          >
            <Button danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tasks}
      pagination={{
        pageSize: 5,
      }}
    />
  );
}

export default TaskList;