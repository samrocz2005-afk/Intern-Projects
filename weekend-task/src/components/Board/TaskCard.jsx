import { Card, Typography } from "antd";
import useUIStore from "../../zustand/uiStore";

const { Text } = Typography;

function TaskCard({
  task,
  onClick,
}) {
  const { darkMode } = useUIStore();

  if (!task) return null;

  const subtasks = Array.isArray(task.subtasks)
    ? task.subtasks
    : [];

  const completedSubtasks = subtasks.filter(
    (subtask) => subtask.done
  ).length;

  const handleDragStart = (event) => {
    event.dataTransfer.setData("taskId", task.id);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Card
      hoverable
      draggable
      onClick={() => onClick?.(task)}
      onDragStart={handleDragStart}
      styles={{
        body: {
          padding: 20,
        },
      }}
      style={{
        width: "100%",
        background: darkMode ? "#2B2C37" : "#FFFFFF",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        userSelect: "none",
        boxShadow: "0 4px 6px rgba(0,0,0,.15)",
        transition: "transform .2s ease",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.transform =
          "translateY(-3px)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.transform =
          "translateY(0)";
      }}
    >
      <Text
        strong
        style={{
          display: "block",
          color: darkMode ? "#FFFFFF" : "#000112",
          fontSize: 15,
          marginBottom: 10,
        }}
      >
        {task.title || "Untitled Task"}
      </Text>

      <Text
        style={{
          color: "#828FA3",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {completedSubtasks} of {subtasks.length} subtasks
      </Text>
    </Card>
  );
}

export default TaskCard;