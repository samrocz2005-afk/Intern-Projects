const Campaign = require("../models/Campaign");
const ApiError = require("../utils/ApiError");

const getPagination = (
  page = 1,
  limit = 10
) => {
  const parsedPage = Math.max(
    Number(page) || 1,
    1
  );

  const parsedLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip:
      (parsedPage - 1) * parsedLimit,
  };
};

const getCampaigns = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const pagination =
    getPagination(page, limit);

  const filter = {};

  if (search?.trim()) {
    filter.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "name",
    "startDate",
    "endDate",
  ];

  const safeSortBy =
    allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

  const safeSortOrder =
    sortOrder === "asc" ? 1 : -1;

  const [campaigns, total] =
    await Promise.all([
      Campaign.find(filter)
        .sort({
          [safeSortBy]: safeSortOrder,
        })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),

      Campaign.countDocuments(filter),
    ]);

  return {
    campaigns,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(
        total / pagination.limit
      ),
    },
  };
};

const getCampaignById = async (
  campaignId
) => {
  const campaign =
    await Campaign.findById(
      campaignId
    ).lean();

  if (!campaign) {
    throw new ApiError(
      404,
      "Campaign not found",
      "CAMPAIGN_NOT_FOUND"
    );
  }

  return campaign;
};

const createCampaign = async (
  campaignData
) => {
  if (
    campaignData.startDate &&
    campaignData.endDate &&
    new Date(
      campaignData.endDate
    ) <=
      new Date(
        campaignData.startDate
      )
  ) {
    throw new ApiError(
      400,
      "End date must be after start date",
      "INVALID_CAMPAIGN_DATES"
    );
  }

  return Campaign.create(
    campaignData
  );
};

const updateCampaign = async (
  campaignId,
  updateData
) => {
  const existingCampaign =
    await Campaign.findById(
      campaignId
    );

  if (!existingCampaign) {
    throw new ApiError(
      404,
      "Campaign not found",
      "CAMPAIGN_NOT_FOUND"
    );
  }

  const startDate =
    updateData.startDate ||
    existingCampaign.startDate;

  const endDate =
    updateData.endDate ||
    existingCampaign.endDate;

  if (
    startDate &&
    endDate &&
    new Date(endDate) <=
      new Date(startDate)
  ) {
    throw new ApiError(
      400,
      "End date must be after start date",
      "INVALID_CAMPAIGN_DATES"
    );
  }

  Object.assign(
    existingCampaign,
    updateData
  );

  await existingCampaign.save();

  return existingCampaign.toObject();
};

const deleteCampaign = async (
  campaignId
) => {
  const campaign =
    await Campaign.findByIdAndDelete(
      campaignId
    ).lean();

  if (!campaign) {
    throw new ApiError(
      404,
      "Campaign not found",
      "CAMPAIGN_NOT_FOUND"
    );
  }

  return campaign;
};

const updateCampaignStatus = async (
  campaignId,
  status
) => {
  const allowedStatuses = [
    "Draft",
    "Scheduled",
    "Active",
    "Paused",
    "Completed",
    "Cancelled",
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    throw new ApiError(
      400,
      "Invalid campaign status",
      "INVALID_CAMPAIGN_STATUS"
    );
  }

  const campaign =
    await Campaign.findByIdAndUpdate(
      campaignId,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

  if (!campaign) {
    throw new ApiError(
      404,
      "Campaign not found",
      "CAMPAIGN_NOT_FOUND"
    );
  }

  return campaign;
};

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  updateCampaignStatus,
};