const instanceService = require("../services/instance.service");

const {
  successResponse,
  createdResponse,
} = require("../utils/apiResponse");

// POST /api/instances
const createInstance = async (
  req,
  res,
  next
) => {
  try {
    const instance =
      await instanceService.createInstance(
        req.user._id,
        req.body
      );

    return createdResponse(
      res,
      instance,
      "Instance created successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/instances
const getInstances = async (
  req,
  res,
  next
) => {
  try {
    const instances =
      await instanceService.getUserInstances(
        req.user._id,
        req.query
      );

    return successResponse(
      res,
      instances,
      "Instances retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/instances/:id
const getInstance = async (
  req,
  res,
  next
) => {
  try {
    const instance =
      await instanceService.getInstanceById(
        req.params.id,
        req.user._id,
        req.user.role === "admin"
      );

    return successResponse(
      res,
      instance,
      "Instance retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// PUT /api/instances/:id
const updateInstance = async (
  req,
  res,
  next
) => {
  try {
    const instance =
      await instanceService.updateInstance(
        req.params.id,
        req.user._id,
        req.body
      );

    return successResponse(
      res,
      instance,
      "Instance updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/instances/:id/start
const startInstance = async (
  req,
  res,
  next
) => {
  try {
    const instance =
      await instanceService.startInstance(
        req.params.id,
        req.user._id
      );

    return successResponse(
      res,
      instance,
      "Instance started successfully"
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/instances/:id/stop
const stopInstance = async (
  req,
  res,
  next
) => {
  try {
    const instance =
      await instanceService.stopInstance(
        req.params.id,
        req.user._id
      );

    return successResponse(
      res,
      instance,
      "Instance stopped successfully"
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/instances/:id/restart
const restartInstance = async (
  req,
  res,
  next
) => {
  try {
    const instance =
      await instanceService.restartInstance(
        req.params.id,
        req.user._id
      );

    return successResponse(
      res,
      instance,
      "Instance restarted successfully"
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/instances/:id
const deleteInstance = async (
  req,
  res,
  next
) => {
  try {
    await instanceService.deleteInstance(
      req.params.id,
      req.user._id
    );

    return successResponse(
      res,
      null,
      "Instance deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInstance,
  getInstances,
  getInstance,
  updateInstance,
  startInstance,
  stopInstance,
  restartInstance,
  deleteInstance,
};