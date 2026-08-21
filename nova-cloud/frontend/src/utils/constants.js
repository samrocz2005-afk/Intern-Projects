// API
export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// User Roles
export const ROLES = {
  USER: "user",
  ADMIN: "admin",
};

// Resource Types
export const RESOURCE_TYPES = {
  INSTANCE: "instance",
  NETWORK: "network",
  STORAGE: "storage",
  ROUTER: "router",
  LOAD_BALANCER: "loadBalancer",
};

// Instance Status
export const INSTANCE_STATUS = {
  RUNNING: "running",
  STOPPED: "stopped",
  STARTING: "starting",
  STOPPING: "stopping",
  RESTARTING: "restarting",
  TERMINATED: "terminated",
  ERROR: "error",
};

// Storage Status
export const STORAGE_STATUS = {
  AVAILABLE: "available",
  ATTACHED: "attached",
  CREATING: "creating",
  DELETING: "deleting",
};

// Network Status
export const NETWORK_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  CREATING: "creating",
};

// Billing Status
export const BILLING_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "cloud_access_token",
  USER: "cloud_user",
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};