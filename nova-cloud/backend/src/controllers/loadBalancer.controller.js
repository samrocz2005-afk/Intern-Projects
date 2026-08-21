const loadBalancerService = require("../services/loadBalancer.service");

const {
  successResponse,
  createdResponse,
} = require("../utils/apiResponse");

// POST /api/load-balancers
const createLoadBalancer = async (
  req,
  res,
  next
) => {
  try {
    const loadBalancer =
      await loadBalancerService.createLoadBalancer(
        req.user._id,
        req.body
      );

    return createdResponse(
      res,
      loadBalancer,
      "Load balancer created successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/load-balancers
const getLoadBalancers = async (
  req,
  res,
  next
) => {
  try {
    const loadBalancers =
      await loadBalancerService.getUserLoadBalancers(
        req.user._id,
        req.query
      );

    return successResponse(
      res,
      loadBalancers,
      "Load balancers retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/load-balancers/:id
const getLoadBalancer = async (
  req,
  res,
  next
) => {
  try {
    const loadBalancer =
      await loadBalancerService.getLoadBalancerById(
        req.params.id,
        req.user._id
      );

    return successResponse(
      res,
      loadBalancer,
      "Load balancer retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/load-balancers/:id/backends
const addBackendInstance = async (
  req,
  res,
  next
) => {
  try {
    const loadBalancer =
      await loadBalancerService.addBackendInstance(
        req.params.id,
        req.user._id,
        req.body
      );

    return successResponse(
      res,
      loadBalancer,
      "Backend instance added successfully"
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/load-balancers/:id/backends/:backendId
const removeBackendInstance = async (
  req,
  res,
  next
) => {
  try {
    const loadBalancer =
      await loadBalancerService.removeBackendInstance(
        req.params.id,
        req.params.backendId,
        req.user._id
      );

    return successResponse(
      res,
      loadBalancer,
      "Backend instance removed successfully"
    );
  } catch (error) {
    next(error);
  }
};

// PATCH /api/load-balancers/:id/backends/:backendId/health
const updateBackendHealth = async (
  req,
  res,
  next
) => {
  try {
    const loadBalancer =
      await loadBalancerService.updateBackendHealth(
        req.params.id,
        req.params.backendId,
        req.body.healthStatus,
        req.user._id
      );

    return successResponse(
      res,
      loadBalancer,
      "Backend health status updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/load-balancers/:id
const deleteLoadBalancer = async (
  req,
  res,
  next
) => {
  try {
    await loadBalancerService.deleteLoadBalancer(
      req.params.id,
      req.user._id
    );

    return successResponse(
      res,
      null,
      "Load balancer deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLoadBalancer,
  getLoadBalancers,
  getLoadBalancer,
  addBackendInstance,
  removeBackendInstance,
  updateBackendHealth,
  deleteLoadBalancer,
};