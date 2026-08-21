import api from "./api";

const loadBalancerApi = {
  // Get user's load balancers
  getLoadBalancers: async (params = {}) => {
    const response = await api.get(
      "/load-balancers",
      {
        params,
      }
    );

    return response.data;
  },

  // Get one load balancer
  getLoadBalancer: async (id) => {
    const response = await api.get(
      `/load-balancers/${id}`
    );

    return response.data;
  },

  // Create load balancer
  createLoadBalancer: async (
    loadBalancerData
  ) => {
    const response = await api.post(
      "/load-balancers",
      loadBalancerData
    );

    return response.data;
  },

  // Add backend instance
  addBackendInstance: async (
    loadBalancerId,
    backendData
  ) => {
    const response = await api.post(
      `/load-balancers/${loadBalancerId}/backends`,
      backendData
    );

    return response.data;
  },

  // Remove backend instance
  removeBackendInstance: async (
    loadBalancerId,
    backendId
  ) => {
    const response = await api.delete(
      `/load-balancers/${loadBalancerId}/backends/${backendId}`
    );

    return response.data;
  },

  // Update backend health
  updateBackendHealth: async (
    loadBalancerId,
    backendId,
    healthStatus
  ) => {
    const response = await api.patch(
      `/load-balancers/${loadBalancerId}/backends/${backendId}/health`,
      {
        healthStatus,
      }
    );

    return response.data;
  },

  // Delete load balancer
  deleteLoadBalancer: async (id) => {
    const response = await api.delete(
      `/load-balancers/${id}`
    );

    return response.data;
  },
};

export default loadBalancerApi;