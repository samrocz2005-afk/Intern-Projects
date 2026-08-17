const asyncHandler = require("../utils/asyncHandler");
const staffService = require("../services/staffService");

const createStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.createStaff(req.body);

  res.status(201).json({
    success: true,
    message: "Staff created successfully",
    data: staff,
  });
});

const getStaff = asyncHandler(async (req, res) => {
  const result = await staffService.getStaff(req.query);

  res.status(200).json({
    success: true,
    message: "Staff fetched successfully",
    data: result.staff,
    pagination: result.pagination,
  });
});

const getStaffById = asyncHandler(async (req, res) => {
  const staff = await staffService.getStaffById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Staff fetched successfully",
    data: staff,
  });
});

const updateStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.updateStaff(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Staff updated successfully",
    data: staff,
  });
});

const updateStaffRole = asyncHandler(async (req, res) => {
  const staff = await staffService.updateStaffRole(
    req.params.id,
    req.body.role
  );

  res.status(200).json({
    success: true,
    message: "Staff role updated successfully",
    data: staff,
  });
});

const updateStaffPermissions = asyncHandler(async (req, res) => {
  const staff = await staffService.updateStaffPermissions(
    req.params.id,
    req.body.permissions
  );

  res.status(200).json({
    success: true,
    message: "Staff permissions updated successfully",
    data: staff,
  });
});

const deactivateStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.updateStaffStatus(
    req.params.id,
    "Inactive"
  );

  res.status(200).json({
    success: true,
    message: "Staff deactivated successfully",
    data: staff,
  });
});

const activateStaff = asyncHandler(async (req, res) => {
  const staff = await staffService.updateStaffStatus(
    req.params.id,
    "Active"
  );

  res.status(200).json({
    success: true,
    message: "Staff activated successfully",
    data: staff,
  });
});

const deleteStaff = asyncHandler(async (req, res) => {
  await staffService.deleteStaff(req.params.id);

  res.status(200).json({
    success: true,
    message: "Staff deleted successfully",
    data: null,
  });
});

module.exports = {
  createStaff,
  getStaff,
  getStaffById,
  updateStaff,
  updateStaffRole,
  updateStaffPermissions,
  activateStaff,
  deactivateStaff,
  deleteStaff,
};