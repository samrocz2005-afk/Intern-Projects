const asyncHandler = require("../utils/asyncHandler");
const transactionService = require("../services/transactionService");

const getTransactions = asyncHandler(async (req, res) => {
  const result = await transactionService.getTransactions(req.query);

  res.status(200).json({
    success: true,
    message: "Transactions fetched successfully",
    data: result.transactions,
    pagination: result.pagination,
  });
});

const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionById(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Transaction fetched successfully",
    data: transaction,
  });
});

const getTransactionByOrder = asyncHandler(async (req, res) => {
  const transaction = await transactionService.getTransactionByOrder(
    req.params.orderId
  );

  res.status(200).json({
    success: true,
    message: "Order transaction fetched successfully",
    data: transaction,
  });
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updatePaymentStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Payment status updated successfully",
    data: transaction,
  });
});

const updateRefundStatus = asyncHandler(async (req, res) => {
  const transaction = await transactionService.updateRefundStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Refund status updated successfully",
    data: transaction,
  });
});

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionByOrder,
  updatePaymentStatus,
  updateRefundStatus,
};