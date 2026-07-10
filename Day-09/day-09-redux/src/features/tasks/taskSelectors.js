// Entire Task State
export const selectTaskState = (state) => state.tasks;

// All Tasks
export const selectTasks = (state) => state.tasks.tasks;

// Loading
export const selectTaskLoading = (state) => state.tasks.loading;

// Error
export const selectTaskError = (state) => state.tasks.error;

// Completed Tasks
export const selectCompletedTasks = (state) =>
  state.tasks.tasks.filter(
    (task) => task.status === "Completed"
  );

// Pending Tasks
export const selectPendingTasks = (state) =>
  state.tasks.tasks.filter(
    (task) => task.status === "Pending"
  );

// High Priority Tasks
export const selectHighPriorityTasks = (state) =>
  state.tasks.tasks.filter(
    (task) => task.priority === "High"
  );

// Total Tasks
export const selectTotalTasks = (state) =>
  state.tasks.tasks.length;