const asyncHandler = require("../utils/asyncHandler");
const discountService = require("../services/discountService");

const createDiscount = asyncHandler(async (req, res) => {
  const discount = await discountService.createDiscount(req.body);

  res.status(201).json({
    success: true,
    message: "Discount created successfully",
    data: discount,
  });
});

const getDiscounts = asyncHandler(async (req, res) => {
  const result = await discountService.getDiscounts(req.query);

  res.status(200).json({
    success: true,
    message: "Discounts fetched successfully",
    data: result.discounts,
    pagination: result.pagination,
  });
});

const getDiscountById = asyncHandler(async (req, res) => {
  const discount = await discountService.getDiscountById(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Discount fetched successfully",
    data: discount,
  });
});

const updateDiscount = asyncHandler(async (req, res) => {
  const discount = await discountService.updateDiscount(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Discount updated successfully",
    data: discount,
  });
});

const deleteDiscount = asyncHandler(async (req, res) => {
  await discountService.deleteDiscount(req.params.id);

  res.status(200).json({
    success: true,
    message: "Discount deleted successfully",
    data: null,
  });
});

const toggleDiscountStatus = asyncHandler(async (req, res) => {
  const discount = await discountService.toggleDiscountStatus(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Discount status updated successfully",
    data: discount,
  });
});

module.exports = {
  createDiscount,
  getDiscounts,
  getDiscountById,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
};