import { Checkbox } from "antd";
import useUIStore from "../../zustand/uiStore";

function SubTask({
  subtask,
  taskId,
  onToggle,
}) {
  const { darkMode } = useUIStore();

  if (!subtask) return null;

  const handleToggle = () => {
    onToggle?.(taskId, subtask.id);
  };

  return (
    <div
      onClick={handleToggle}
      style={{
        background: darkMode ? "#20212C" : "#F4F7FD",
        borderRadius: 4,
        padding: "12px 16px",
        cursor: "pointer",
        transition: "all .2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = darkMode
          ? "#2F3140"
          : "#ECEFFF";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = darkMode
          ? "#20212C"
          : "#F4F7FD";
      }}
    >
      <Checkbox
        checked={subtask.done}
        onChange={handleToggle}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: subtask.done
              ? "#828FA3"
              : darkMode
              ? "#FFFFFF"
              : "#000112",
            textDecoration: subtask.done
              ? "line-through"
              : "none",
            fontWeight: 700,
            fontSize: 12,
            lineHeight: "15px",
            opacity: subtask.done ? 0.5 : 1,
            transition: "all .2s ease",
          }}
        >
          {subtask.title}
        </span>
      </Checkbox>
    </div>
  );
}

export default SubTask;