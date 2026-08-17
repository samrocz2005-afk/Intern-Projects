const mongoose = require("mongoose");
const Inventory = require("../models/Inventory");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const parsePagination = (page, limit) => {
  const parsedPage = Number.parseInt(page, 10) || DEFAULT_PAGE;
  const parsedLimit = Number.parseInt(limit, 10) || DEFAULT_LIMIT;

  return {
    page: Math.max(parsedPage, 1),
    limit: Math.min(Math.max(parsedLimit, 1), MAX_LIMIT),
  };
};

const getInventory = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  search = "",
  status,
  sortOrder = "asc",
} = {}) => {
  const pagination = parsePagination(page, limit);
  const filter = {};

  if (status === "low") {
    filter.$expr = {
      $and: [
        { $gt: ["$quantity", 0] },
        { $lte: ["$quantity", "$lowStockThreshold"] },
      ],
    };
  }

  if (status === "out") {
    filter.quantity = 0;
  }

  const normalizedSearch = String(search).trim();
  const skip = (pagination.page - 1) * pagination.limit;

  let query = Inventory.find(filter)
    .populate({
      path: "product",
      select: "name sku price image status category",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .sort({
      stock: sortOrder === "desc" ? -1 : 1, 
      createdAt: -1,
    })
    .skip(skip)
    .limit(pagination.limit);

  if (normalizedSearch) {
    const safeSearch = normalizedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const products = await Product.find({
      $or: [
        { name: { $regex: safeSearch, $options: "i" } },
        { sku: { $regex: safeSearch, $options: "i" } },
      ],
    })
      .select("_id")
      .lean();

    const productIds = products.map((product) => product._id);
    filter.product = { $in: productIds };

    query = Inventory.find(filter)
      .populate("product", "name sku price image status")
      .sort({
        quantity: sortOrder === "desc" ? -1 : 1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(pagination.limit);
  }

  const [inventory, total] = await Promise.all([
    query.lean(),
    Inventory.countDocuments(filter),
  ]);

  return {
    inventory,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getInventoryById = async (inventoryId) => {
  if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
    throw new ApiError(400, "Invalid inventory ID", "INVALID_INVENTORY_ID");
  }

  const inventory = await Inventory.findById(inventoryId)
    .populate("product", "name sku price image status")
    .lean();

  if (!inventory) {
    throw new ApiError(404, "Inventory record not found", "INVENTORY_NOT_FOUND");
  }

  return inventory;
};

const updateInventory = async (inventoryId, inventoryData) => {
  if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
    throw new ApiError(400, "Invalid inventory ID", "INVALID_INVENTORY_ID");
  }

  const inventory = await Inventory.findByIdAndUpdate(
    inventoryId,
    inventoryData,
    { new: true, runValidators: true }
  )
    .populate("product", "name sku price image status")
    .lean();

  if (!inventory) {
    throw new ApiError(404, "Inventory record not found", "INVENTORY_NOT_FOUND");
  }

  if (Object.prototype.hasOwnProperty.call(inventoryData, "quantity")) {
    await Product.findByIdAndUpdate(
      inventory.product._id,
      { stock: inventory.quantity },
      { runValidators: true }
    );
  }

  return inventory;
};

const adjustStock = async (inventoryId, adjustment, reason) => {
  if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
    throw new ApiError(400, "Invalid inventory ID", "INVALID_INVENTORY_ID");
  }

  const quantityAdjustment = Number(adjustment);

  if (!Number.isInteger(quantityAdjustment) || quantityAdjustment === 0) {
    throw new ApiError(400, "Stock adjustment must be a non-zero integer", "INVALID_STOCK_ADJUSTMENT");
  }

  const inventory = await Inventory.findById(inventoryId);

  if (!inventory) {
    throw new ApiError(404, "Inventory record not found", "INVENTORY_NOT_FOUND");
  }

  if (inventory.quantity + quantityAdjustment < 0) {
    throw new ApiError(409, "Stock cannot become negative", "INSUFFICIENT_STOCK");
  }

  const updatedInventory = await Inventory.findOneAndUpdate(
    {
      _id: inventoryId,
      quantity: {
        $gte: quantityAdjustment < 0 ? Math.abs(quantityAdjustment) : 0,
      },
    },
    {
      $inc: { quantity: quantityAdjustment },
      $set: { lastAdjustmentReason: reason?.trim() || "" },
    },
    { new: true, runValidators: true }
  )
    .populate("product", "name sku price image status")
    .lean();

  if (!updatedInventory) {
    throw new ApiError(409, "Stock adjustment could not be completed", "STOCK_ADJUSTMENT_FAILED");
  }

  await Product.findByIdAndUpdate(
    updatedInventory.product._id,
    { stock: updatedInventory.quantity },
    { runValidators: true }
  );

  return updatedInventory;
};

const getLowStockInventory = async ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = {}) => {
  return getInventory({ page, limit, status: "low" });
};

const getOutOfStockInventory = async ({ page = DEFAULT_PAGE, limit = DEFAULT_LIMIT } = {}) => {
  return getInventory({ page, limit, status: "out" });
};

module.exports = {
  getInventory,
  getInventoryById,
  getInventoryByProduct: getInventoryById,
  updateInventory,
  updateStock: updateInventory,
  adjustStock,
  getLowStockInventory,
  getLowStockProducts: getLowStockInventory,
  getOutOfStockInventory,
  getOutOfStockProducts: getOutOfStockInventory,
};