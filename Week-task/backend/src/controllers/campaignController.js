const asyncHandler = require("../utils/asyncHandler");
const campaignService = require("../services/campaignService");

const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body);

  res.status(201).json({
    success: true,
    message: "Campaign created successfully",
    data: campaign,
  });
});

const getCampaigns = asyncHandler(async (req, res) => {
  const result = await campaignService.getCampaigns(req.query);

  res.status(200).json({
    success: true,
    message: "Campaigns fetched successfully",
    data: result.campaigns,
    pagination: result.pagination,
  });
});

const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await campaignService.getCampaignById(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Campaign fetched successfully",
    data: campaign,
  });
});

const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.updateCampaign(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Campaign updated successfully",
    data: campaign,
  });
});

const deleteCampaign = asyncHandler(async (req, res) => {
  await campaignService.deleteCampaign(req.params.id);

  res.status(200).json({
    success: true,
    message: "Campaign deleted successfully",
    data: null,
  });
});

const updateCampaignStatus = asyncHandler(async (req, res) => {
  const campaign = await campaignService.updateCampaignStatus(
    req.params.id,
    req.body.status
  );

  res.status(200).json({
    success: true,
    message: "Campaign status updated successfully",
    data: campaign,
  });
});

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  updateCampaignStatus,
};