import TaskCard from "./TaskCard";

const DEFAULT_COLORS = {
  todo: "#49C4E5",
  doing: "#8471F2",
  present: "#67E2AE",
  done: "#67E2AE",
};

function Column({
  column,
  onTaskClick,
  onDropTask,
}) {
  if (!column) return null;

  const tasks = Array.isArray(column.tasks)
    ? column.tasks
    : [];

  const columnName =
    column.name || column.title || "Untitled";

  const columnColor =
    column.color ||
    DEFAULT_COLORS[columnName.toLowerCase()] ||
    "#635FC7";

  const handleDrop = (e) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData("taskId");

    if (!taskId) return;

    onDropTask?.(taskId, column.id);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        minWidth: 280,
        width: 280,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: "50%",
            background: columnColor,
          }}
        />

        <span
          style={{
            color: "#828FA3",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {columnName} ({tasks.length})
        </span>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          minHeight: 120,
        }}
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick?.(task)}
            />
          ))
        ) : (
          <div
            style={{
              color: "#828FA3",
              fontSize: 13,
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

export default Column;