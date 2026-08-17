const mongoose = require("mongoose");
const Settings = require("../models/Settings");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");

const getSettings = async () => {
  let settings = await Settings.findOne()
    .select("-__v")
    .lean();

  if (!settings) {
    settings = await Settings.create({
      storeName: "Shopping App",
    });

    settings = settings.toObject();
    delete settings.__v;
  }

  return settings;
};

const updateSettings = async (updateData) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(updateData);
  } else {
    Object.assign(settings, updateData);
    await settings.save();
  }

  const result = settings.toObject();
  delete result.__v;

  return result;
};

const updateStoreSettings = async (storeData) => {
  const allowedFields = [
    "storeName",
    "storeEmail",
    "storePhone",
    "storeAddress",
    "currency",
    "timezone",
    "logo",
  ];

  const update = {};
  for (const field of allowedFields) {
    if (storeData[field] !== undefined) {
      update[field] = storeData[field];
    }
  }

  return updateSettings(update);
};

const updateGeneralSettings = async (generalData) => {
  const allowedFields = [
    "currency",
    "timezone",
    "language",
    "dateFormat",
    "notificationsEnabled",
    "maintenanceMode",
  ];

  const update = {};
  for (const field of allowedFields) {
    if (generalData[field] !== undefined) {
      update[field] = generalData[field];
    }
  }

  return updateSettings(update);
};

const getProfileSettings = async (userId) => {
  let settings = await Settings.findOne()
    .select("-__v")
    .lean();

  if (!settings) {
    settings = await Settings.create({
      storeName: "Shopping App",
      language: "English",
      notifications: true,
    });
    settings = settings.toObject();
    delete settings.__v;
  }

  let user = null;
  if (userId && userId !== "env-admin-id" && mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId).lean();
  }

  return {
    language: user?.language || settings.language || "English",
    notifications: user?.notifications ?? settings.notifications ?? true,
  };
};

const updateProfileSettings = async (userId, profileData) => {
  const { currentPassword, newPassword, language, notifications } = profileData;

  // 1. Only process a password change if the user actually entered a new password
  if (newPassword && newPassword.trim() !== "") {
    if (!currentPassword) {
      throw new ApiError(400, "Current password is required to set a new password");
    }

    if (!userId || userId === "env-admin-id" || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid or missing user ID for password update");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.password) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new ApiError(400, "Incorrect current password");
      }
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
  }

  // 2. Update preferences in the singleton Settings collection
  const update = {};
  if (language !== undefined) update.language = language;
  if (notifications !== undefined) update.notifications = notifications;

  if (Object.keys(update).length > 0) {
    return updateSettings(update);
  }

  return getSettings();
};

module.exports = {
  getSettings,
  getProfileSettings,
  updateSettings,
  updateStoreSettings,
  updateProfileSettings,
  updateGeneralSettings,
};