const asyncHandler = require("../utils/asyncHandler");
const supportService = require("../services/supportService");

const createTicket = asyncHandler(async (req, res) => {
  const ticket = await supportService.createTicket(req.body);

  res.status(201).json({
    success: true,
    message: "Support ticket created successfully",
    data: ticket,
  });
});

const getTickets = asyncHandler(async (req, res) => {
  const result = await supportService.getTickets(req.query);

  res.status(200).json({
    success: true,
    message: "Support tickets fetched successfully",
    data: result.tickets,
    pagination: result.pagination,
  });
});

const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await supportService.getTicketById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Support ticket fetched successfully",
    data: ticket,
  });
});

const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await supportService.updateTicket(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Support ticket updated successfully",
    data: ticket,
  });
});

const updateTicketStatus = asyncHandler(async (req, res) => {
  const ticket = await supportService.updateTicketStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Support ticket status updated successfully",
    data: ticket,
  });
});

const addMessage = asyncHandler(async (req, res) => {
  const ticket = await supportService.addMessage(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Support message added successfully",
    data: ticket,
  });
});

const deleteTicket = asyncHandler(async (req, res) => {
  await supportService.deleteTicket(req.params.id);

  res.status(200).json({
    success: true,
    message: "Support ticket deleted successfully",
    data: null,
  });
});

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  addMessage,
  deleteTicket,
};