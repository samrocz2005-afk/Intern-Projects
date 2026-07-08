// Login Validation
export const validateLogin = (email, password) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Enter a valid email";
  }

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};

// Task Validation
export const validateTask = (title) => {
  const errors = {};

  const taskTitle = title.trim();

  if (!taskTitle) {
    errors.title = "Task title is required";
  } else if (taskTitle.length < 3) {
    errors.title = "Title must be at least 3 characters";
  } else if (taskTitle.length > 60) {
    errors.title = "Title cannot exceed 60 characters";
  } else if (!/^[A-Za-z\s,.-]+$/.test(taskTitle)) {
    errors.title =
      "Only letters, spaces, hyphens (-), commas (,), and periods (.) are allowed";
  }

  return errors;
};