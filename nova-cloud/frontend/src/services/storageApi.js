import api from "./api";

const storageApi = {
  // Get user's storage volumes
  getStorage: async (params = {}) => {
    const response = await api.get(
      "/storage",
      {
        params,
      }
    );

    return response.data;
  },

  // Get one storage volume
  getStorageById: async (id) => {
    const response = await api.get(
      `/storage/${id}`
    );

    return response.data;
  },

  // Create storage
  createStorage: async (storageData) => {
    const response = await api.post(
      "/storage",
      storageData
    );

    return response.data;
  },

  // Update storage
  updateStorage: async (
    id,
    storageData
  ) => {
    const response = await api.put(
      `/storage/${id}`,
      storageData
    );

    return response.data;
  },

  // Attach storage to instance
  attachStorage: async (
    storageId,
    instanceId
  ) => {
    const response = await api.post(
      `/storage/${storageId}/attach`,
      {
        instanceId,
      }
    );

    return response.data;
  },

  // Detach storage from instance
  detachStorage: async (storageId) => {
    const response = await api.post(
      `/storage/${storageId}/detach`
    );

    return response.data;
  },

  // Delete storage
  deleteStorage: async (id) => {
    const response = await api.delete(
      `/storage/${id}`
    );

    return response.data;
  },
};

export default storageApi;