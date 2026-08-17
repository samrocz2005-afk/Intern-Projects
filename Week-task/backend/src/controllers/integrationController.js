const asyncHandler = require("../utils/asyncHandler");
const integrationService = require("../services/integrationService");

const createIntegration = asyncHandler(async (req, res) => {
  const integration = await integrationService.createIntegration(
    req.body
  );

  res.status(201).json({
    success: true,
    message: "Integration created successfully",
    data: integration,
  });
});

const getIntegrations = asyncHandler(async (req, res) => {
  const result = await integrationService.getIntegrations(req.query);

  res.status(200).json({
    success: true,
    message: "Integrations fetched successfully",
    data: result.integrations,
    pagination: result.pagination,
  });
});

const getIntegrationById = asyncHandler(async (req, res) => {
  const integration = await integrationService.getIntegrationById(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Integration fetched successfully",
    data: integration,
  });
});

const updateIntegration = asyncHandler(async (req, res) => {
  const integration = await integrationService.updateIntegration(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Integration updated successfully",
    data: integration,
  });
});

const updateIntegrationStatus = asyncHandler(async (req, res) => {
  const integration = await integrationService.updateIntegrationStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Integration status updated successfully",
    data: integration,
  });
});

const deleteIntegration = asyncHandler(async (req, res) => {
  await integrationService.deleteIntegration(req.params.id);

  res.status(200).json({
    success: true,
    message: "Integration deleted successfully",
    data: null,
  });
});

module.exports = {
  createIntegration,
  getIntegrations,
  getIntegrationById,
  updateIntegration,
  updateIntegrationStatus,
  deleteIntegration,
};