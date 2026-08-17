const asyncHandler = require("../utils/asyncHandler");
const categoryService = require("../services/categoryService");

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategories(req.query);

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: result.categories,
    pagination: result.pagination,
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(
    req.params.id,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
    data: null,
  });
});

const toggleCategoryStatus = asyncHandler(async (req, res) => {
  const category = await categoryService.toggleCategoryStatus(
    req.params.id
  );

  res.status(200).json({
    success: true,
    message: "Category status updated successfully",
    data: category,
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};