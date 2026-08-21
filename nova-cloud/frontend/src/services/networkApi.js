import api from "./api";

const networkApi = {
  // Get all user's networks
  getNetworks: async (params = {}) => {
    const response = await api.get(
      "/networks",
      {
        params,
      }
    );

    return response.data;
  },

  // Get one network
  getNetwork: async (id) => {
    const response = await api.get(
      `/networks/${id}`
    );

    return response.data;
  },

  // Create network
  createNetwork: async (networkData) => {
    const response = await api.post(
      "/networks",
      networkData
    );

    return response.data;
  },

  // Update network
  updateNetwork: async (
    id,
    networkData
  ) => {
    const response = await api.put(
      `/networks/${id}`,
      networkData
    );

    return response.data;
  },

  // Delete network
  deleteNetwork: async (id) => {
    const response = await api.delete(
      `/networks/${id}`
    );

    return response.data;
  },
};

export default networkApi;