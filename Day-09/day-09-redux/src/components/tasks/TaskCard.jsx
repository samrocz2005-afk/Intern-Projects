import React from "react";
import { Card, Tag, Space, Button } from "antd";

function TaskCard({ task, onEdit, onDelete }) {
  const statusColor = {
    Pending: "orange",
    "In Progress": "blue",
    Completed: "green",
  };

  const priorityColor = {
    High: "red",
    Medium: "gold",
    Low: "green",
  };

  return (
    <Card
      title={task.title}
      style={{ marginBottom: 16 }}
    >
      <p>
        <strong>Description:</strong>
        <br />
        {task.description}
      </p>

      <Space style={{ marginBottom: 15 }}>
        <Tag color={priorityColor[task.priority]}>
          {task.priority}
        </Tag>

        <Tag color={statusColor[task.status]}>
          {task.status}
        </Tag>
      </Space>

      <p>
        <strong>Due Date:</strong> {task.dueDate}
      </p>

      <Space>
        <Button
          type="primary"
          onClick={() => onEdit(task)}
        >
          Edit
        </Button>

        <Button
          danger
          onClick={() => onDelete(task)}
        >
          Delete
        </Button>
      </Space>
    </Card>
  );
}

export default TaskCard;