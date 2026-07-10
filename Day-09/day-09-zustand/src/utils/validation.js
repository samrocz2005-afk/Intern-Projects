// ==============================
// Login Validation
// ==============================

export const emailRules = [
  {
    required: true,
    message: "Email is required.",
  },
  {
    type: "email",
    message: "Enter a valid email address.",
  },
];

export const passwordRules = [
  {
    required: true,
    message: "Password is required.",
  },
  {
    min: 6,
    message: "Password must be at least 6 characters.",
  },
];

// ==============================
// Task Validation
// ==============================

export const titleRules = [
  {
    required: true,
    message: "Task title is required.",
  },
  {
    min: 3,
    message: "Minimum 3 characters.",
  },
  {
    max: 100,
    message: "Maximum 100 characters.",
  },
];

export const descriptionRules = [
  {
    required: true,
    message: "Description is required.",
  },
  {
    min: 10,
    message: "Minimum 10 characters.",
  },
];

export const priorityRules = [
  {
    required: true,
    message: "Select a priority.",
  },
];

export const statusRules = [
  {
    required: true,
    message: "Select a status.",
  },
];

export const dueDateRules = [
  {
    required: true,
    message: "Select a due date.",
  },
];

// ==============================
// Profile Validation
// ==============================

export const nameRules = [
  {
    required: true,
    message: "Name is required.",
  },
];

export const departmentRules = [
  {
    required: true,
    message: "Department is required.",
  },
];

export const rollNumberRules = [
  {
    required: true,
    message: "Roll Number is required.",
  },
];