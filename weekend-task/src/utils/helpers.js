// ===================================
// Generate Unique ID
// ===================================

export const generateId = () => {
  return Date.now().toString();
};

// ===================================
// Completed Subtasks Count
// ===================================

export const getCompletedSubtasks = (subtasks = []) => {
  return subtasks.filter((subtask) => subtask.done).length;
};

// ===================================
// Total Subtasks
// ===================================

export const getTotalSubtasks = (subtasks = []) => {
  return subtasks.length;
};

// ===================================
// Find Board
// ===================================

export const findBoard = (boards, boardId) => {
  return boards.find((board) => board.id === boardId);
};

// ===================================
// Find Column
// ===================================

export const findColumn = (columns, columnId) => {
  return columns.find((column) => column.id === columnId);
};

// ===================================
// Find Task
// ===================================

export const findTask = (tasks, taskId) => {
  return tasks.find((task) => task.id === taskId);
};

// ===================================
// Move Task
// ===================================

export const moveTask = (
  boards,
  taskId,
  sourceColumnId,
  destinationColumnId
) => {
  const updatedBoards = [...boards];

  let task = null;

  updatedBoards.forEach((board) => {
    board.columns.forEach((column) => {
      if (column.id === sourceColumnId) {
        const index = column.tasks.findIndex(
          (item) => item.id === taskId
        );

        if (index !== -1) {
          task = column.tasks.splice(index, 1)[0];
        }
      }
    });
  });

  if (!task) {
    return updatedBoards;
  }

  updatedBoards.forEach((board) => {
    board.columns.forEach((column) => {
      if (column.id === destinationColumnId) {
        task.status = destinationColumnId;
        column.tasks.push(task);
      }
    });
  });

  return updatedBoards;
};

// ===================================
// Sort Tasks
// ===================================

export const sortTasks = (tasks = []) => {
  return [...tasks].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
};

// ===================================
// Search Tasks
// ===================================

export const searchTasks = (tasks = [], keyword = "") => {
  return tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(keyword.toLowerCase())
  );
};

// ===================================
// Format Date
// ===================================

export const formatDate = (date = new Date()) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ===================================
// Capitalize
// ===================================

export const capitalize = (text = "") => {
  if (!text) {
    return "";
  }

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1)
  );
};