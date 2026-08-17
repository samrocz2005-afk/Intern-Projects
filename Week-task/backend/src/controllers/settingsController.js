const asyncHandler = require("../utils/asyncHandler");
const settingsService = require("../services/settingsService");

const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings();

  res.status(200).json({
    success: true,
    message: "Settings fetched successfully",
    data: settings,
  });
});

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Settings updated successfully",
    data: settings,
  });
});

const getStoreSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getStoreSettings();

  res.status(200).json({
    success: true,
    message: "Store settings fetched successfully",
    data: settings,
  });
});

const updateStoreSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateStoreSettings(
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Store settings updated successfully",
    data: settings,
  });
});

const getProfileSettings = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const settings = await settingsService.getProfileSettings(userId);

  res.status(200).json({
    success: true,
    message: "Profile settings fetched successfully",
    data: settings,
  });
});

const updateProfileSettings = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?._id;
  const settings = await settingsService.updateProfileSettings(
    userId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Profile settings updated successfully",
    data: settings,
  });
});

module.exports = {
  getSettings,
  updateSettings,
  getStoreSettings,
  updateStoreSettings,
  getProfileSettings,
  updateProfileSettings,
};