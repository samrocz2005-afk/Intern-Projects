const routerService = require("../services/router.service");

const {
  successResponse,
  createdResponse,
} = require("../utils/apiResponse");

// POST /api/routers
const createRouter = async (req, res, next) => {
  try {
    const router = await routerService.createRouter(
      req.user._id,
      req.body
    );

    return createdResponse(
      res,
      router,
      "Router created successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/routers
const getRouters = async (req, res, next) => {
  try {
    const routers =
      await routerService.getUserRouters(
        req.user._id,
        req.query
      );

    return successResponse(
      res,
      routers,
      "Routers retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/routers/:id
const getRouter = async (req, res, next) => {
  try {
    const router =
      await routerService.getRouterById(
        req.params.id,
        req.user._id
      );

    return successResponse(
      res,
      router,
      "Router retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// PUT /api/routers/:id
const updateRouter = async (req, res, next) => {
  try {
    const router =
      await routerService.updateRouter(
        req.params.id,
        req.user._id,
        req.body
      );

    return successResponse(
      res,
      router,
      "Router updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/routers/:id/networks
const connectNetwork = async (
  req,
  res,
  next
) => {
  try {
    const router =
      await routerService.connectNetwork(
        req.params.id,
        req.body.networkId,
        req.user._id
      );

    return successResponse(
      res,
      router,
      "Network connected successfully"
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/routers/:id/networks/:networkId
const disconnectNetwork = async (
  req,
  res,
  next
) => {
  try {
    const router =
      await routerService.disconnectNetwork(
        req.params.id,
        req.params.networkId,
        req.user._id
      );

    return successResponse(
      res,
      router,
      "Network disconnected successfully"
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/routers/:id
const deleteRouter = async (
  req,
  res,
  next
) => {
  try {
    await routerService.deleteRouter(
      req.params.id,
      req.user._id
    );

    return successResponse(
      res,
      null,
      "Router deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRouter,
  getRouters,
  getRouter,
  updateRouter,
  connectNetwork,
  disconnectNetwork,
  deleteRouter,
};