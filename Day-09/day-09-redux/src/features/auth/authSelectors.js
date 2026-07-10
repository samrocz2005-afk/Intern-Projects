// Entire Auth State
export const selectAuth = (state) => state.auth;

// Logged-in User
export const selectCurrentUser = (state) => state.auth.user;

// Login Token
export const selectToken = (state) => state.auth.token;

// Authentication Status
export const selectIsAuthenticated = (state) =>
  state.auth.isAuthenticated;

// Loading
export const selectAuthLoading = (state) =>
  state.auth.loading;

// Error
export const selectAuthError = (state) =>
  state.auth.error;