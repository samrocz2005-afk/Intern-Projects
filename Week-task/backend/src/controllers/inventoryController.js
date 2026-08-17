const asyncHandler = require("../utils/asyncHandler");
const inventoryService = require("../services/inventoryService");

const getInventory = asyncHandler(async (req, res) => {
  const result = await inventoryService.getInventory(req.query);

  res.status(200).json({
    success: true,
    message: "Inventory fetched successfully",
    data: result.inventory,
    pagination: result.pagination,
  });
});

const getInventoryByProduct = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getInventoryById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Inventory record fetched successfully",
    data: inventory,
  });
});

const updateStock = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.updateInventory(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Stock updated successfully",
    data: inventory,
  });
});

const adjustStock = asyncHandler(async (req, res) => {
  const { adjustment, reason } = req.body;
  const inventory = await inventoryService.adjustStock(
    req.params.id,
    adjustment,
    reason
  );

  res.status(200).json({
    success: true,
    message: "Stock adjusted successfully",
    data: inventory,
  });
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const result = await inventoryService.getLowStockInventory(req.query);

  res.status(200).json({
    success: true,
    message: "Low-stock products fetched successfully",
    data: result.inventory,
    pagination: result.pagination,
  });
});

const getOutOfStockProducts = asyncHandler(async (req, res) => {
  const result = await inventoryService.getOutOfStockInventory(req.query);

  res.status(200).json({
    success: true,
    message: "Out-of-stock products fetched successfully",
    data: result.inventory,
    pagination: result.pagination,
  });
});

module.exports = {
  getInventory,
  getInventoryByProduct,
  updateStock,
  adjustStock,
  getLowStockProducts,
  getOutOfStockProducts,
};