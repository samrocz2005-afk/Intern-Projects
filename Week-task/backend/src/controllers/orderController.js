const asyncHandler = require("../utils/asyncHandler");
const orderService = require("../services/orderService");

const createOrder = asyncHandler(async (req, res) => {
  // Pass req.user.id as the customer id into the service
  const userId = req.user?.id;

  const order = await orderService.createOrder(userId, req.body);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: order,
  });
});

const getOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getOrders(req.query);

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    data: result.orders,
    pagination: result.pagination,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order fetched successfully",
    data: order,
  });
});

const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrder(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    data: order,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(
    req.params.id,
    req.body.reason
  );

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  cancelOrder,
};