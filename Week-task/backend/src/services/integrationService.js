const Integration = require("../models/Integration");
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

const SENSITIVE_FIELDS = [
  "apiKey",
  "apiSecret",
  "secret",
  "password",
  "accessToken",
  "refreshToken",
  "clientSecret",
];

const sanitizeIntegration = (
  integration
) => {
  if (!integration) {
    return null;
  }

  const result =
    typeof integration.toObject ===
    "function"
      ? integration.toObject()
      : { ...integration };

  for (const field of SENSITIVE_FIELDS) {
    if (result[field] !== undefined) {
      result[field] =
        "[CONFIGURED]";
    }
  }

  if (
    result.credentials &&
    typeof result.credentials ===
      "object"
  ) {
    result.credentials = {
      configured: true,
    };
  }

  return result;
};

const getIntegrations = async ({
  page = 1,
  limit = 10,
  type,
  status,
} = {}) => {
  const pagination =
    getPagination(page, limit);

  const filter = {};

  if (type) {
    filter.type = type;
  }

  if (status) {
    filter.status = status;
  }

  const [integrations, total] =
    await Promise.all([
      Integration.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),

      Integration.countDocuments(filter),
    ]);

  return {
    integrations:
      integrations.map(
        sanitizeIntegration
      ),

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

const getIntegrationById = async (
  integrationId
) => {
  const integration =
    await Integration.findById(
      integrationId
    ).lean();

  if (!integration) {
    throw new ApiError(
      404,
      "Integration not found",
      "INTEGRATION_NOT_FOUND"
    );
  }

  return sanitizeIntegration(
    integration
  );
};

const createIntegration = async (
  integrationData
) => {
  const existingIntegration =
    await Integration.findOne({
      name: integrationData.name
        ?.trim(),
    }).lean();

  if (existingIntegration) {
    throw new ApiError(
      409,
      "Integration already exists",
      "INTEGRATION_ALREADY_EXISTS"
    );
  }

  const integration =
    await Integration.create({
      ...integrationData,
      name:
        integrationData.name?.trim(),
    });

  return sanitizeIntegration(
    integration
  );
};

const updateIntegration = async (
  integrationId,
  updateData
) => {
  const integration =
    await Integration.findById(
      integrationId
    );

  if (!integration) {
    throw new ApiError(
      404,
      "Integration not found",
      "INTEGRATION_NOT_FOUND"
    );
  }

  Object.assign(
    integration,
    updateData
  );

  await integration.save();

  return sanitizeIntegration(
    integration
  );
};

const updateIntegrationStatus = async (
  integrationId,
  status
) => {
  const allowedStatuses = [
    "Active",
    "Inactive",
    "Error",
    "Pending",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid integration status",
      "INVALID_INTEGRATION_STATUS"
    );
  }

  const integration =
    await Integration.findByIdAndUpdate(
      integrationId,
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

  if (!integration) {
    throw new ApiError(
      404,
      "Integration not found",
      "INTEGRATION_NOT_FOUND"
    );
  }

  return sanitizeIntegration(
    integration
  );
};

const deleteIntegration = async (
  integrationId
) => {
  const integration =
    await Integration.findByIdAndDelete(
      integrationId
    ).lean();

  if (!integration) {
    throw new ApiError(
      404,
      "Integration not found",
      "INTEGRATION_NOT_FOUND"
    );
  }

  return sanitizeIntegration(
    integration
  );
};

module.exports = {
  getIntegrations,
  getIntegrationById,
  createIntegration,
  updateIntegration,
  updateIntegrationStatus,
  deleteIntegration,
};