import { Empty } from "antd";
import Column from "./Column";
import useUIStore from "../../zustand/uiStore";

function Board({
  board,
  onTaskClick,
  onDropTask,
  onAddColumn,
}) {
  const { darkMode } = useUIStore();

  if (!board) {
    return (
      <div
        style={{
          height: "calc(100vh - 96px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: darkMode ? "#20212C" : "#F4F7FD",
        }}
      >
        <Empty description="No Board Available" />
      </div>
    );
  }

  const columns = board.columns || [];

  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        padding: 24,
        overflowX: "auto",
        overflowY: "hidden",
        minHeight: "calc(100vh - 96px)",
        background: darkMode ? "#20212C" : "#F4F7FD",
      }}
    >
      {columns.map((column) => (
        <Column
          key={column.id}
          column={{
            ...column,
            tasks: column.tasks || [],
          }}
          onTaskClick={onTaskClick}
          onDropTask={onDropTask}
        />
      ))}

      <div
        onClick={() => onAddColumn?.()}
        style={{
          minWidth: 280,
          minHeight: 400,
          borderRadius: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: 24,
          fontWeight: 700,
          color: "#828FA3",
          background: darkMode
            ? "linear-gradient(180deg,#2B2C37 0%,#20212C 100%)"
            : "linear-gradient(180deg,#E9EFFA 0%,#F4F7FD 100%)",
        }}
      >
        + New Column
      </div>
    </div>
  );
}

export default Board;