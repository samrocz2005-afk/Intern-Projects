// ==============================
// Email
// ==============================

export const validateEmail = (_, value) => {
  if (!value) {
    return Promise.reject("Email is required");
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return Promise.reject("Enter a valid email");
  }

  return Promise.resolve();
};

// ==============================
// Password
// ==============================

export const validatePassword = (_, value) => {
  if (!value) {
    return Promise.reject("Password is required");
  }

  if (value.length < 6) {
    return Promise.reject(
      "Password must be at least 6 characters"
    );
  }

  return Promise.resolve();
};

// ==============================
// Board Name
// ==============================

export const validateBoardName = (_, value) => {
  if (!value || !value.trim()) {
    return Promise.reject("Board name is required");
  }

  return Promise.resolve();
};

// ==============================
// Column Name
// ==============================

export const validateColumnName = (_, value) => {
  if (!value || !value.trim()) {
    return Promise.reject("Column name is required");
  }

  return Promise.resolve();
};

// ==============================
// Task Title
// ==============================

export const validateTaskTitle = (_, value) => {
  if (!value || !value.trim()) {
    return Promise.reject("Task title is required");
  }

  return Promise.resolve();
};

// ==============================
// Subtask
// ==============================

export const validateSubtask = (_, value) => {
  if (!value || !value.trim()) {
    return Promise.reject("Subtask is required");
  }

  return Promise.resolve();
};

// ==============================
// Description
// ==============================

export const validateDescription = (_, value) => {
  if (!value) {
    return Promise.resolve();
  }

  if (value.length > 500) {
    return Promise.reject(
      "Description cannot exceed 500 characters"
    );
  }

  return Promise.resolve();
};