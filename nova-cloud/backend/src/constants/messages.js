const MESSAGES = {
  // --------------------------------------------------------------------------
  // Authentication
  // --------------------------------------------------------------------------

  AUTH: {
    AUTHENTICATION_REQUIRED:
      "Authentication required",

    USER_NOT_FOUND:
      "User no longer exists",

    ACCOUNT_INACTIVE:
      "Your account is inactive",

    TOKEN_EXPIRED:
      "Token has expired",

    INVALID_TOKEN:
      "Invalid authentication token",

    INVALID_CREDENTIALS:
      "Invalid email or password",

    LOGIN_SUCCESS:
      "Login successful",

    LOGOUT_SUCCESS:
      "Logout successful",

    REGISTRATION_SUCCESS:
      "Registration successful",

    PASSWORD_CHANGED:
      "Password changed successfully",

    PROFILE_UPDATED:
      "Profile updated successfully",
  },

  // --------------------------------------------------------------------------
  // Common
  // --------------------------------------------------------------------------

  COMMON: {
    INTERNAL_SERVER_ERROR:
      "Internal server error",

    VALIDATION_FAILED:
      "Validation failed",

    RESOURCE_NOT_FOUND:
      "Resource not found",

    ACCESS_DENIED:
      "Access denied",

    FORBIDDEN:
      "You do not have permission to perform this action",

    INVALID_ID:
      "Invalid resource ID",

    DUPLICATE_RESOURCE:
      "A resource with the same value already exists",

    OPERATION_SUCCESS:
      "Operation completed successfully",
  },

  PROFILE: {
    IMAGE_REQUIRED:
        "Profile image is required",

    IMAGE_UPLOADED:
        "Profile image uploaded successfully",

    INVALID_IMAGE:
        "Only JPEG, PNG, WebP and GIF images are allowed",

    IMAGE_TOO_LARGE:
        "Profile image must not exceed 5MB",
    },

  // --------------------------------------------------------------------------
  // API
  // --------------------------------------------------------------------------

  API: {
    ROUTE_NOT_FOUND:
      "Route not found",

    RATE_LIMIT_EXCEEDED:
      "Too many requests. Please try again later.",

    REQUEST_FAILED:
      "Request failed",
  },

  // --------------------------------------------------------------------------
  // Server
  // --------------------------------------------------------------------------

  SERVER: {
    DATABASE_ERROR:
      "Database operation failed",

    SERVICE_UNAVAILABLE:
      "Service temporarily unavailable",
  },
};

module.exports = MESSAGES;