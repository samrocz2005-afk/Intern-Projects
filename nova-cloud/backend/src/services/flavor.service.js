const Flavor = require("../models/Flavor");

// Get flavors for users
const getFlavors = async (filters = {}) => {
  const query = {
    isActive: true,
  };

  // Search
  if (filters.search) {
    query.name = {
      $regex: filters.search,
      $options: "i",
    };
  }

  // Optional isActive filter
  // Admin can use this, but for safety the normal
  // user endpoint still returns only active flavors.
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }

  const sortBy =
    filters.sortBy || "createdAt";

  const sortOrder =
    filters.sortOrder === "asc" ? 1 : -1;

  const sort = {
    [sortBy]: sortOrder,
  };

  const page =
    Number(filters.page) || 1;

  const limit =
    Number(filters.limit) || 20;

  const skip = (page - 1) * limit;

  const [items, total] =
    await Promise.all([
      Flavor.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Flavor.countDocuments(query),
    ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit
    ),
  };
};

// Get all active flavors
const getActiveFlavors = async () => {
  return Flavor.find({
    isActive: true,
  }).sort({
    hourlyPrice: 1,
  });
};

// Get all flavors - Admin
const getAllFlavors = async () => {
  return Flavor.find().sort({
    createdAt: -1,
  });
};

// Get flavor by ID
const getFlavorById = async (
  flavorId
) => {
  const flavor =
    await Flavor.findById(flavorId);

  if (!flavor) {
    const error = new Error(
      "Flavor not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return flavor;
};

// Create flavor - Admin
const createFlavor = async (data) => {
  const {
    name,
    description,
    vcpus,
    ram,
    disk,
    hourlyPrice,
    monthlyPrice,
  } = data;

  const existingFlavor =
    await Flavor.findOne({
      name: name.trim(),
    });

  if (existingFlavor) {
    const error = new Error(
      "A flavor with this name already exists"
    );

    error.statusCode = 409;

    throw error;
  }

  return Flavor.create({
    name,
    description,
    vcpus,
    ram,
    disk,
    hourlyPrice,
    monthlyPrice,
  });
};

// Update flavor - Admin
const updateFlavor = async (
  flavorId,
  data
) => {
  const flavor =
    await Flavor.findById(flavorId);

  if (!flavor) {
    const error = new Error(
      "Flavor not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const allowedFields = [
    "name",
    "description",
    "vcpus",
    "ram",
    "disk",
    "hourlyPrice",
    "monthlyPrice",
    "isActive",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      flavor[field] = data[field];
    }
  });

  await flavor.save();

  return flavor;
};

// Disable flavor
const deactivateFlavor = async (
  flavorId
) => {
  const flavor =
    await Flavor.findById(flavorId);

  if (!flavor) {
    const error = new Error(
      "Flavor not found"
    );

    error.statusCode = 404;

    throw error;
  }

  flavor.isActive = false;

  await flavor.save();

  return flavor;
};

module.exports = {
  getFlavors,
  getActiveFlavors,
  getAllFlavors,
  getFlavorById,
  createFlavor,
  updateFlavor,
  deactivateFlavor,
};