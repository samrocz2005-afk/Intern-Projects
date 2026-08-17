const asyncHandler = require("../utils/asyncHandler");
const customerService = require("../services/customerService");

const getCustomers = asyncHandler(async (req, res) => {
  const result = await customerService.getCustomers(
    req.query
  );

  res.status(200).json({
    success: true,
    message: "Customers fetched successfully",
    data: result.customers,
    pagination: result.pagination,
  });
});

const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomerById(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Customer fetched successfully",
    data: customer,
  });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Customer updated successfully",
    data: customer,
  });
});

const toggleCustomerStatus = asyncHandler(async (req, res) => {
  const customer = await customerService.toggleCustomerStatus(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Customer status updated successfully",
    data: customer,
  });
});

const getCustomerOrders = asyncHandler(async (req, res) => {
  const result = await customerService.getCustomerOrders(
    req.params.id,
    req.query
  );

  res.status(200).json({
    success: true,
    message: "Customer orders fetched successfully",
    data: result.orders,
    pagination: result.pagination,
  });
});

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomer,
  toggleCustomerStatus,
  getCustomerOrders,
};