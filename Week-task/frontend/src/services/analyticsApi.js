import api from "./axios";

export const getDashboardAnalytics = async (params = {}) => {
  const response = await api.get("/analytics", {
    params,
  });

  return response.data;
};