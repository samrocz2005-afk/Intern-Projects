const networkService = require("../services/network.service");

const { successResponse, createdResponse } = require("../utils/apiResponse");

/*
|--------------------------------------------------------------------------
| POST /api/networks
| ADMIN ONLY
|--------------------------------------------------------------------------
*/

const createNetwork = async (req, res, next) => {
  try {
    const network = await networkService.createNetwork(req.user._id, req.body);

    return createdResponse(res, network, "Network created successfully");
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET /api/networks
| ADMIN + USER
|--------------------------------------------------------------------------
|
| Admin:
|   Can see all networks.
|
| User:
|   Can see active networks only.
|
|--------------------------------------------------------------------------
*/

const getNetworks = async (req, res, next) => {
  try {
    const networks = await networkService.getUserNetworks(
      req.user._id,
      req.query,
    );

    return successResponse(res, networks, "Networks retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET /api/networks/:id
| ADMIN + USER
|--------------------------------------------------------------------------
*/

const getNetwork = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === "admin";

    const network = await networkService.getNetworkById(
      req.params.id,
      req.user._id,
      isAdmin,
    );

    return successResponse(res, network, "Network retrieved successfully");
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| PUT /api/networks/:id
| ADMIN ONLY
|--------------------------------------------------------------------------
*/

const updateNetwork = async (req, res, next) => {
  try {
    const network = await networkService.updateNetwork(
      req.params.id,
      req.user._id,
      req.body,
    );

    return successResponse(res, network, "Network updated successfully");
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| DELETE /api/networks/:id
| ADMIN ONLY
|--------------------------------------------------------------------------
*/

const deleteNetwork = async (req, res, next) => {
  try {
    await networkService.deleteNetwork(req.params.id, req.user._id);

    return successResponse(res, null, "Network deleted successfully");
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  createNetwork,
  getNetworks,
  getNetwork,
  updateNetwork,
  deleteNetwork,
};
