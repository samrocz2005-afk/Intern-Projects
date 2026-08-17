import api from "./axios";

// Get all orders
export const getOrders = async (params = {}) => {
  const response = await api.get("/orders", {
    params,
  });

  return response.data;
};

// Get single order
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};

// Create order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);

  return response.data;
};

// Update order
export const updateOrder = async (id, orderData) => {
  const response = await api.put(
    `/orders/${id}`,
    orderData
  );

  return response.data;
};

// Delete order
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);

  return response.data;
};

// Update order status
export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(
    `/orders/${id}/status`,
    { status }
  );

  return response.data;
};