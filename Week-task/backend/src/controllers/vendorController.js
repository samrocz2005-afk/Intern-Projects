const asyncHandler = require("../utils/asyncHandler");
const vendorService = require("../services/vendorService");

const createVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.createVendor(req.body);

  res.status(201).json({
    success: true,
    message: "Vendor created successfully",
    data: vendor,
  });
});

const getVendors = asyncHandler(async (req, res) => {
  const result = await vendorService.getVendors(req.query);

  res.status(200).json({
    success: true,
    message: "Vendors fetched successfully",
    data: result.vendors,
    pagination: result.pagination,
  });
});

const getVendorById = asyncHandler(async (req, res) => {
  const vendor = await vendorService.getVendorById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Vendor fetched successfully",
    data: vendor,
  });
});

const updateVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateVendor(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Vendor updated successfully",
    data: vendor,
  });
});

const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateVendorStatus(
    req.params.id,
    "Approved"
  );

  res.status(200).json({
    success: true,
    message: "Vendor approved successfully",
    data: vendor,
  });
});

const rejectVendor = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateVendorStatus(
    req.params.id,
    "Rejected"
  );

  res.status(200).json({
    success: true,
    message: "Vendor rejected successfully",
    data: vendor,
  });
});

const deleteVendor = asyncHandler(async (req, res) => {
  await vendorService.deleteVendor(req.params.id);

  res.status(200).json({
    success: true,
    message: "Vendor deleted successfully",
    data: null,
  });
});

module.exports = {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  approveVendor,
  rejectVendor,
  deleteVendor,
};