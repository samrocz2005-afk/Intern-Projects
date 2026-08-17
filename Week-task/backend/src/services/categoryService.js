const mongoose = require("mongoose");

const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const ALLOWED_SORT_FIELDS = [
  "name",
  "createdAt",
  "updatedAt",
];

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parsePagination = (page, limit) => {
  const parsedPage = Number.parseInt(page, 10) || DEFAULT_PAGE;
  const parsedLimit = Number.parseInt(limit, 10) || DEFAULT_LIMIT;

  return {
    page: Math.max(parsedPage, 1),
    limit: Math.min(Math.max(parsedLimit, 1), MAX_LIMIT),
  };
};

const getCategories = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  search = "",
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const pagination = parsePagination(page, limit);

  const filter = {};

  const normalizedSearch = String(search).trim();

  if (normalizedSearch) {
    filter.name = {
      $regex: escapeRegex(normalizedSearch),
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : "createdAt";

  const sort = {
    [safeSortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const skip = (pagination.page - 1) * pagination.limit;

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pagination.limit)
      .lean(),

    Category.countDocuments(filter),
  ]);

  return {
    categories,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getCategoryById = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(
      400,
      "Invalid category ID",
      "INVALID_CATEGORY_ID"
    );
  }

  const category = await Category.findById(categoryId).lean();

  if (!category) {
    throw new ApiError(
      404,
      "Category not found",
      "CATEGORY_NOT_FOUND"
    );
  }

  return category;
};

const createCategory = async (categoryData) => {
  const name = categoryData.name?.trim();

  const existingCategory = await Category.findOne({
    name: {
      $regex: `^${escapeRegex(name)}$`,
      $options: "i",
    },
  }).lean();

  if (existingCategory) {
    throw new ApiError(
      409,
      "Category already exists",
      "DUPLICATE_CATEGORY"
    );
  }

  const category = await Category.create({
    ...categoryData,
    name,
  });

  return category.toObject();
};

const updateCategory = async (
  categoryId,
  categoryData
) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(
      400,
      "Invalid category ID",
      "INVALID_CATEGORY_ID"
    );
  }

  const updateData = { ...categoryData };

  if (updateData.name) {
    updateData.name = updateData.name.trim();

    const duplicateCategory = await Category.findOne({
      name: {
        $regex: `^${escapeRegex(updateData.name)}$`,
        $options: "i",
      },
      _id: {
        $ne: categoryId,
      },
    }).lean();

    if (duplicateCategory) {
      throw new ApiError(
        409,
        "Category already exists",
        "DUPLICATE_CATEGORY"
      );
    }
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!category) {
    throw new ApiError(
      404,
      "Category not found",
      "CATEGORY_NOT_FOUND"
    );
  }

  return category;
};

const updateCategoryStatus = async (
  categoryId,
  status
) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(
      400,
      "Invalid category ID",
      "INVALID_CATEGORY_ID"
    );
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    { status },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  if (!category) {
    throw new ApiError(
      404,
      "Category not found",
      "CATEGORY_NOT_FOUND"
    );
  }

  return category;
};

const deleteCategory = async (categoryId) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(
      400,
      "Invalid category ID",
      "INVALID_CATEGORY_ID"
    );
  }

  const category = await Category.findByIdAndDelete(
    categoryId
  );

  if (!category) {
    throw new ApiError(
      404,
      "Category not found",
      "CATEGORY_NOT_FOUND"
    );
  }

  return category;
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};