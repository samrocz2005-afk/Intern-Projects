// Entire Profile State
export const selectProfileState = (state) => state.profile;

// Student Profile
export const selectProfile = (state) => state.profile.profile;

// Loading
export const selectProfileLoading = (state) =>
  state.profile.loading;

// Error
export const selectProfileError = (state) =>
  state.profile.error;

// Student Name
export const selectStudentName = (state) =>
  state.profile.profile?.name;

// Student Email
export const selectStudentEmail = (state) =>
  state.profile.profile?.email;

// Department
export const selectStudentDepartment = (state) =>
  state.profile.profile?.department;

// Roll Number
export const selectStudentRollNumber = (state) =>
  state.profile.profile?.rollNumber;