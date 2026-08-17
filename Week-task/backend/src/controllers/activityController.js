const asyncHandler = require("../utils/asyncHandler");
const activityService = require("../services/activityService");

const getActivityLogs = asyncHandler(async (req, res) => {
  const result = await activityService.getActivityLogs(req.query);

  res.status(200).json({
    success: true,
    message: "Activity logs fetched successfully",
    data: result.logs,
    pagination: result.pagination,
  });
});

const getActivityLogById = asyncHandler(async (req, res) => {
  const log = await activityService.getActivityLogById(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Activity log fetched successfully",
    data: log,
  });
});

const getUserActivityLogs = asyncHandler(async (req, res) => {
  const result = await activityService.getUserActivityLogs(
    req.params.userId,
    req.query
  );

  res.status(200).json({
    success: true,
    message: "User activity logs fetched successfully",
    data: result.logs,
    pagination: result.pagination,
  });
});

module.exports = {
  getActivityLogs,
  getActivityLogById,
  getUserActivityLogs,
};