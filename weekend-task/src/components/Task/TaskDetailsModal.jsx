import { useEffect, useState } from "react";
import {
  Modal,
  Typography,
  Select,
  Dropdown,
  Button,
} from "antd";
import {
  MoreVert,
  Edit,
  Delete,
} from "@mui/icons-material";

import SubTask from "./SubTask";
import useUIStore from "../../zustand/uiStore";

const { Title, Paragraph } = Typography;

function TaskDetailsModal({
  open,
  task,
  columns = [],
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onSubtaskToggle,
}) {
  const { darkMode } = useUIStore();

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (open && task) {
      setStatus(task.status);
    }
  }, [open, task]);

  if (!task) return null;

  const subtasks = task.subtasks || [];

  const completed = subtasks.filter(
    (subtask) => subtask.done
  ).length;

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "edit":
        onEdit?.(task);
        break;

      case "delete":
        onDelete?.(task);
        break;

      default:
        break;
    }
  };

  const menuItems = [
    {
      key: "edit",
      icon: <Edit fontSize="small" />,
      label: "Edit Task",
    },
    {
      key: "delete",
      icon: <Delete fontSize="small" />,
      label: "Delete Task",
      danger: true,
    },
  ];

  const handleStatusChange = (value) => {
    setStatus(value);
    onStatusChange?.(task.id, value);
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      width={480}
      closable={false}
      destroyOnHidden
      onCancel={onClose}
      styles={{
        content: {
          background: darkMode ? "#2B2C37" : "#FFFFFF",
          borderRadius: 8,
          padding: 32,
        },
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 24,
        }}
      >
        <Title
          level={4}
          style={{
            margin: 0,
            maxWidth: "90%",
            fontSize: 24,
            lineHeight: "30px",
            fontWeight: 700,
            color: darkMode ? "#FFFFFF" : "#000112",
          }}
        >
          {task.title}
        </Title>

        <Dropdown
          trigger={["click"]}
          menu={{
            items: menuItems,
            onClick: handleMenuClick,
          }}
        >
          <Button
            type="text"
            style={{
              padding: 0,
              width: 24,
              height: 24,
            }}
            icon={
              <MoreVert
                style={{
                  color: "#828FA3",
                }}
              />
            }
          />
        </Dropdown>
      </div>

      {/* Description */}
      <Paragraph
        style={{
          color: "#828FA3",
          fontSize: 13,
          lineHeight: "23px",
          marginBottom: 24,
        }}
      >
        {task.description ||
          "No description available."}
      </Paragraph>

      {/* Subtask Title */}
      <Paragraph
        style={{
          color: "#828FA3",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".5px",
          marginBottom: 16,
        }}
      >
        Subtasks ({completed} of {subtasks.length})
      </Paragraph>

      {/* Subtasks */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 24,
        }}
      >
        {subtasks.length > 0 ? (
          subtasks.map((subtask) => (
            <SubTask
              key={subtask.id}
              subtask={subtask}
              taskId={task.id}
              onToggle={onSubtaskToggle}
            />
          ))
        ) : (
          <Paragraph
            style={{
              color: "#828FA3",
              marginBottom: 0,
            }}
          >
            No subtasks available.
          </Paragraph>
        )}
      </div>

      {/* Status */}
      <Paragraph
        style={{
          color: "#828FA3",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: ".5px",
          marginBottom: 8,
        }}
      >
        Current Status
      </Paragraph>

      <Select
        value={status}
        size="large"
        style={{
          width: "100%",
        }}
        onChange={handleStatusChange}
        options={columns.map((column) => ({
          label: column.name,
          value: column.id,
        }))}
      />
    </Modal>
  );
}

export default TaskDetailsModal;