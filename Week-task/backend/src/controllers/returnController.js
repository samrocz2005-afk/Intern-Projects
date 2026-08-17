const asyncHandler = require("../utils/asyncHandler");
const returnService = require("../services/returnService");

const createReturn = asyncHandler(async (req, res) => {
  const returnRequest = await returnService.createReturn(req.body);

  res.status(201).json({
    success: true,
    message: "Return request created successfully",
    data: returnRequest,
  });
});

const getReturns = asyncHandler(async (req, res) => {
  const result = await returnService.getReturns(req.query);

  res.status(200).json({
    success: true,
    message: "Return requests fetched successfully",
    data: result.returns,
    pagination: result.pagination,
  });
});

const getReturnById = asyncHandler(async (req, res) => {
  const returnRequest = await returnService.getReturnById(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Return request fetched successfully",
    data: returnRequest,
  });
});

const updateReturn = asyncHandler(async (req, res) => {
  const returnRequest = await returnService.updateReturn(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Return request updated successfully",
    data: returnRequest,
  });
});

const approveReturn = asyncHandler(async (req, res) => {
  const returnRequest = await returnService.updateReturnStatus(
    req.params.id,
    "Approved"
  );

  res.status(200).json({
    success: true,
    message: "Return request approved successfully",
    data: returnRequest,
  });
});

const rejectReturn = asyncHandler(async (req, res) => {
  const returnRequest = await returnService.updateReturnStatus(
    req.params.id,
    "Rejected"
  );

  res.status(200).json({
    success: true,
    message: "Return request rejected successfully",
    data: returnRequest,
  });
});

const processRefund = asyncHandler(async (req, res) => {
  const returnRequest = await returnService.processRefund(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Refund processed successfully",
    data: returnRequest,
  });
});

const createExchange = asyncHandler(async (req, res) => {
  // FIXED: Changed from returnService.createExchange to returnService.processExchange 
  // to match the function name exported in your returnService.js file.
  const returnRequest = await returnService.processExchange(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Exchange request created successfully",
    data: returnRequest,
  });
});

module.exports = {
  createReturn,
  getReturns,
  getReturnById,
  updateReturn,
  approveReturn,
  rejectReturn,
  processRefund,
  createExchange,
};