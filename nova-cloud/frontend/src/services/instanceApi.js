import api from "./api";

const instanceApi = {
  // Get user's instances
  getInstances: async (params = {}) => {
    const response = await api.get(
      "/instances",
      {
        params,
      }
    );

    return response.data;
  },

  // Get one instance
  getInstance: async (id) => {
    const response = await api.get(
      `/instances/${id}`
    );

    return response.data;
  },

  // Create instance
  createInstance: async (instanceData) => {
    const response = await api.post(
      "/instances",
      instanceData
    );

    return response.data;
  },

  // Update instance
  updateInstance: async (
    id,
    instanceData
  ) => {
    const response = await api.put(
      `/instances/${id}`,
      instanceData
    );

    return response.data;
  },

  // Start instance
  startInstance: async (id) => {
    const response = await api.post(
      `/instances/${id}/start`
    );

    return response.data;
  },

  // Stop instance
  stopInstance: async (id) => {
    const response = await api.post(
      `/instances/${id}/stop`
    );

    return response.data;
  },

  // Restart instance
  restartInstance: async (id) => {
    const response = await api.post(
      `/instances/${id}/restart`
    );

    return response.data;
  },

  // Delete instance
  deleteInstance: async (id) => {
    const response = await api.delete(
      `/instances/${id}`
    );

    return response.data;
  },
};

export default instanceApi;