const flavorService = require("../services/flavor.service");

const {
  successResponse,
  createdResponse,
} = require("../utils/apiResponse");

// GET /api/flavors
const getFlavors = async (
  req,
  res,
  next
) => {
  try {
    const flavors =
      await flavorService.getFlavors(
        req.query
      );

    return successResponse(
      res,
      flavors,
      "Flavors retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/flavors/:id
const getFlavor = async (
  req,
  res,
  next
) => {
  try {
    const flavor =
      await flavorService.getFlavorById(
        req.params.id
      );

    return successResponse(
      res,
      flavor,
      "Flavor retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// POST /api/flavors
// Admin only
const createFlavor = async (
  req,
  res,
  next
) => {
  try {
    const flavor =
      await flavorService.createFlavor(
        req.body
      );

    return createdResponse(
      res,
      flavor,
      "Flavor created successfully"
    );
  } catch (error) {
    next(error);
  }
};

// PUT /api/flavors/:id
// Admin only
const updateFlavor = async (
  req,
  res,
  next
) => {
  try {
    const flavor =
      await flavorService.updateFlavor(
        req.params.id,
        req.body
      );

    return successResponse(
      res,
      flavor,
      "Flavor updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// PATCH /api/flavors/:id/status
// Admin only
const updateFlavorStatus = async (
  req,
  res,
  next
) => {
  try {
    const flavor =
      await flavorService.updateFlavorStatus(
        req.params.id,
        req.body.isActive
      );

    return successResponse(
      res,
      flavor,
      "Flavor status updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// DELETE /api/flavors/:id
// Admin only
const deleteFlavor = async (
  req,
  res,
  next
) => {
  try {
    await flavorService.deleteFlavor(
      req.params.id
    );

    return successResponse(
      res,
      null,
      "Flavor deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFlavors,
  getFlavor,
  createFlavor,
  updateFlavor,
  updateFlavorStatus,
  deleteFlavor,
};