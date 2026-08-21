import api from "./api";

const routerApi = {
  // Get user's routers
  getRouters: async (params = {}) => {
    const response = await api.get(
      "/routers",
      {
        params,
      }
    );

    return response.data;
  },

  // Get one router
  getRouter: async (id) => {
    const response = await api.get(
      `/routers/${id}`
    );

    return response.data;
  },

  // Create router
  createRouter: async (routerData) => {
    const response = await api.post(
      "/routers",
      routerData
    );

    return response.data;
  },

  // Update router
  updateRouter: async (
    id,
    routerData
  ) => {
    const response = await api.put(
      `/routers/${id}`,
      routerData
    );

    return response.data;
  },

  // Connect network to router
  connectNetwork: async (
    routerId,
    networkId
  ) => {
    const response = await api.post(
      `/routers/${routerId}/networks`,
      {
        networkId,
      }
    );

    return response.data;
  },

  // Disconnect network from router
  disconnectNetwork: async (
    routerId,
    networkId
  ) => {
    const response = await api.delete(
      `/routers/${routerId}/networks/${networkId}`
    );

    return response.data;
  },

  // Delete router
  deleteRouter: async (id) => {
    const response = await api.delete(
      `/routers/${id}`
    );

    return response.data;
  },
};

export default routerApi;