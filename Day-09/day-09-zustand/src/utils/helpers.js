// ==============================
// Format Date
// ==============================

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN");
};

// ==============================
// Greeting
// ==============================

export const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
};

// ==============================
// Count Completed Tasks
// ==============================

export const getCompletedTaskCount = (tasks) => {
  return tasks.filter(
    (task) => task.status === "Completed"
  ).length;
};

// ==============================
// Count Pending Tasks
// ==============================

export const getPendingTaskCount = (tasks) => {
  return tasks.filter(
    (task) => task.status === "Pending"
  ).length;
};

// ==============================
// Count Total Tasks
// ==============================

export const getTotalTaskCount = (tasks) => {
  return tasks.length;
};

// ==============================
// Search Tasks
// ==============================

export const searchTasks = (tasks, keyword) => {
  return tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(keyword.toLowerCase())
  );
};

// ==============================
// Sort Tasks by Title
// ==============================

export const sortTasksByTitle = (tasks) => {
  return [...tasks].sort((a, b) =>
    a.title.localeCompare(b.title)
  );
};