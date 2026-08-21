const storageService = require("../services/storage.service");

const {
  successResponse,
  createdResponse,
} = require("../utils/apiResponse");

// POST /api/storage
const createStorage = async (
  req,
  res,
  next
) => {
  try {
    const storage =
      await storageService.createStorage(
        req.user._id,
        req.body
      );

    return createdResponse(
      res,
      storage,
      "Storage created successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/storage
const getStorage = async (
  req,
  res,
  next
) => {
  try {
    const storage =
      await storageService.getUserStorage(
        req.user._id,
        req.query
      );

    return successResponse(
      res,
      storage,
      "Storage retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/storage/:id
const getStorageById = async (
  req,
  res,
  next
) => {
  try {
    const storage =
      await storageService.getStorageById(
        req.params.id,
        req.user._id
      );

    return successResponse(
      res,
      storage,
      "Storage retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// PUT /api/storage/:id
const updateStorage = async (
  req,
  res,
  next
) => {
  try {
    const storage =
      await storageService.updateStorage(
        req.params.id,
        req.user._id,
        req.body
      );

    return successResponse(
      res,
      storage,
      "Storage updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/storage/:id/attach
const attachStorage = async (
  req,
  res,
  next
) => {
  try {
    const storage =
      await storageService.attachStorage(
        req.params.id,
        req.user._id,
        req.body.instanceId
      );

    return successResponse(
      res,
      storage,
      "Storage attached successfully"
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/storage/:id/detach
const detachStorage = async (
  req,
  res,
  next
) => {
  try {
    const storage =
      await storageService.detachStorage(
        req.params.id,
        req.user._id
      );

    return successResponse(
      res,
      storage,
      "Storage detached successfully"
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/storage/:id
const deleteStorage = async (
  req,
  res,
  next
) => {
  try {
    await storageService.deleteStorage(
      req.params.id,
      req.user._id
    );

    return successResponse(
      res,
      null,
      "Storage deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStorage,
  getStorage,
  getStorageById,
  updateStorage,
  attachStorage,
  detachStorage,
  deleteStorage,
};