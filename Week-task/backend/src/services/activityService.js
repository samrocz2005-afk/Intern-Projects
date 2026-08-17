const mongoose = require("mongoose");
const ActivityLog = require("../models/ActivityLog");
const ApiError = require("../utils/ApiError");

const getPagination = (page = 1, limit = 20) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(
    Math.max(Number(limit) || 20, 1),
    100
  );

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const createActivityLog = async ({
  user,
  action,
  module,
  description,
  ip,
  metadata,
}) => {
  if (!action || !module) {
    throw new ApiError(
      400,
      "Activity action and module are required",
      "INVALID_ACTIVITY_LOG"
    );
  }

  return ActivityLog.create({
    user,
    action,
    module,
    description,
    ip,
    metadata,
  });
};

const getUserActivityLogs = async (userId, { page = 1, limit = 20 } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(
      400,
      "Invalid user ID format",
      "INVALID_ID"
    );
  }

  const pagination = getPagination(page, limit);
  const filter = { user: userId };

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      //.populate("user", "_id firstName lastName email role")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    ActivityLog.countDocuments(filter),
  ]);

  return {
    logs,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getActivityLogs = async ({
  page = 1,
  limit = 20,
  search = "",
  action,
  module,
  user,
  startDate,
  endDate,
} = {}) => {
  const pagination = getPagination(page, limit);

  const filter = {};

  if (search?.trim()) {
    const searchRegex = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    filter.$or = [
      { user: searchRegex },
      { action: searchRegex },
      { module: searchRegex },
      { description: searchRegex },
    ];
  }

  if (action) {
    filter.action = action;
  }

  if (module) {
    filter.module = module;
  }

  if (user) {
    filter.user = user;
  }

  if (startDate || endDate) {
    filter.createdAt = {};

    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filter.createdAt.$lte = end;
    }
  }

  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate(
        "user",
        "_id firstName lastName email role"
      )
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    ActivityLog.countDocuments(filter),
  ]);

  return {
    logs,
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

const getActivityLogById = async (activityId) => {
  // Validate MongoDB ObjectId to prevent cast crashes
  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    throw new ApiError(
      400,
      "Invalid activity log ID format",
      "INVALID_ID"
    );
  }

  const log = await ActivityLog.findById(activityId)
    .populate(
      "user",
      "_id firstName lastName email role"
    )
    .lean();

  if (!log) {
    throw new ApiError(
      404,
      "Activity log not found",
      "ACTIVITY_LOG_NOT_FOUND"
    );
  }

  return log;
};

const deleteActivityLog = async (activityId) => {
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(activityId)) {
    throw new ApiError(
      400,
      "Invalid activity log ID format",
      "INVALID_ID"
    );
  }

  const log = await ActivityLog.findByIdAndDelete(
    activityId
  ).lean();

  if (!log) {
    throw new ApiError(
      404,
      "Activity log not found",
      "ACTIVITY_LOG_NOT_FOUND"
    );
  }

  return log;
};

const clearOldLogs = async (beforeDate) => {
  const date = new Date(beforeDate);

  if (Number.isNaN(date.getTime())) {
    throw new ApiError(
      400,
      "Invalid date",
      "INVALID_DATE"
    );
  }

  const result = await ActivityLog.deleteMany({
    createdAt: {
      $lt: date,
    },
  });

  return {
    deletedCount: result.deletedCount,
  };
};

module.exports = {
  createActivityLog,
  getActivityLogs,
  getUserActivityLogs,
  getActivityLogById,
  deleteActivityLog,
  clearOldLogs,
};