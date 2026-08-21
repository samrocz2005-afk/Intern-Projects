import { useDispatch, useSelector } from "react-redux";

import {
  login,
  logout,
  register,
  getMe,
  changePassword,
  clearAuthError,
} from "../redux/slices/authSlice";

import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from "../redux/selectors/resourceSelectors";

const useAuth = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(
    selectIsAuthenticated
  );
  const loading = useSelector(
    selectAuthLoading
  );
  const error = useSelector(
    selectAuthError
  );

  const handleLogin = async (
    credentials
  ) => {
    return dispatch(
      login(credentials)
    ).unwrap();
  };

  const handleRegister = async (
    userData
  ) => {
    return dispatch(
      register(userData)
    ).unwrap();
  };

  const handleLogout = async () => {
    return dispatch(
      logout()
    ).unwrap();
  };

  const handleGetMe = async () => {
    return dispatch(
      getMe()
    ).unwrap();
  };

  const handleChangePassword = async (
    passwordData
  ) => {
    return dispatch(
      changePassword(passwordData)
    ).unwrap();
  };

  const clearError = () => {
    dispatch(clearAuthError());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,

    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getMe: handleGetMe,
    changePassword: handleChangePassword,

    clearError,
  };
};

export default useAuth;