const mongoose = require("mongoose");

const Product = require("../models/Product");
const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

const ALLOWED_SORT_FIELDS = [
  "name",
  "price",
  "stock",
  "createdAt",
  "updatedAt",
];

const ALLOWED_SORT_ORDERS = ["asc", "desc"];

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

const getProducts = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  search = "",
  category,
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const pagination = parsePagination(page, limit);

  const filter = {};

  const normalizedSearch = String(search).trim();

  if (normalizedSearch) {
    const safeSearch = escapeRegex(normalizedSearch);

    filter.$or = [
      {
        name: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        sku: {
          $regex: safeSearch,
          $options: "i",
        },
      },
      {
        description: {
          $regex: safeSearch,
          $options: "i",
        },
      },
    ];
  }

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw new ApiError(
        400,
        "Invalid category ID",
        "INVALID_CATEGORY_ID"
      );
    }

    filter.category = category;
  }

  if (status) {
    filter.status = status;
  }

  const safeSortBy = ALLOWED_SORT_FIELDS.includes(sortBy)
    ? sortBy
    : "createdAt";

  const safeSortOrder = ALLOWED_SORT_ORDERS.includes(sortOrder)
    ? sortOrder
    : "desc";

  const sort = {
    [safeSortBy]: safeSortOrder === "asc" ? 1 : -1,
  };

  const skip = (pagination.page - 1) * pagination.limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name status")
      .sort(sort)
      .skip(skip)
      .limit(pagination.limit)
      .lean(),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(total / pagination.limit),
    },
  };
};

const getProductById = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(
      400,
      "Invalid product ID",
      "INVALID_PRODUCT_ID"
    );
  }

  const product = await Product.findById(productId)
    .populate("category", "name status")
    .lean();

  if (!product) {
    throw new ApiError(
      404,
      "Product not found",
      "PRODUCT_NOT_FOUND"
    );
  }

  return product;
};

const createProduct = async (productData) => {
  const {
    name,
    sku,
    category,
    price,
    stock,
    image,
    description,
    status,
  } = productData;

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw new ApiError(
        400,
        "Invalid category ID",
        "INVALID_CATEGORY_ID"
      );
    }

    const categoryExists = await Category.exists({
      _id: category,
    });

    if (!categoryExists) {
      throw new ApiError(
        404,
        "Category not found",
        "CATEGORY_NOT_FOUND"
      );
    }
  }

  const normalizedSku = sku?.trim().toUpperCase();

  if (normalizedSku) {
    const existingProduct = await Product.findOne({
      sku: normalizedSku,
    }).lean();

    if (existingProduct) {
      throw new ApiError(
        409,
        "Product SKU already exists",
        "DUPLICATE_PRODUCT_SKU"
      );
    }
  }

  const product = await Product.create({
    name: name?.trim(),
    sku: normalizedSku,
    category,
    price,
    stock: stock !== undefined ? stock : 0,
    image,
    description,
    status,
  });

  return Product.findById(product._id)
    .populate("category", "name status")
    .lean();
};

const updateProduct = async (productId, productData) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(
      400,
      "Invalid product ID",
      "INVALID_PRODUCT_ID"
    );
  }

  const updateData = { ...productData };

  if (updateData.category) {
    if (!mongoose.Types.ObjectId.isValid(updateData.category)) {
      throw new ApiError(
        400,
        "Invalid category ID",
        "INVALID_CATEGORY_ID"
      );
    }

    const categoryExists = await Category.exists({
      _id: updateData.category,
    });

    if (!categoryExists) {
      throw new ApiError(
        404,
        "Category not found",
        "CATEGORY_NOT_FOUND"
      );
    }
  }

  if (updateData.sku) {
    updateData.sku = updateData.sku.trim().toUpperCase();

    const duplicateSku = await Product.findOne({
      sku: updateData.sku,
      _id: { $ne: productId },
    }).lean();

    if (duplicateSku) {
      throw new ApiError(
        409,
        "Product SKU already exists",
        "DUPLICATE_PRODUCT_SKU"
      );
    }
  }

  if (updateData.name) {
    updateData.name = updateData.name.trim();
  }

  const product = await Product.findByIdAndUpdate(
    productId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate("category", "name status")
    .lean();

  if (!product) {
    throw new ApiError(
      404,
      "Product not found",
      "PRODUCT_NOT_FOUND"
    );
  }

  return product;
};

const deleteProduct = async (productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(
      400,
      "Invalid product ID",
      "INVALID_PRODUCT_ID"
    );
  }

  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw new ApiError(
      404,
      "Product not found",
      "PRODUCT_NOT_FOUND"
    );
  }

  return product;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};