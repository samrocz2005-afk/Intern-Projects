const mongoose = require("mongoose");

const PRODUCT_STATUSES = [
  "Active",
  "Inactive",
  "Draft",
  "Out of Stock",
];

const validateProductData = (data, { isUpdate = false } = {}) => {
  const errors = [];
  const value = {};

  const fields = [
    "name",
    "description",
    "sku",
    "category",
    "price",
    "stock",
    "image",
    "status",
  ];

  for (const field of fields) {
    if (data[field] !== undefined) {
      value[field] = data[field];
    }
  }

  if (!isUpdate || data.name !== undefined) {
    if (
      typeof data.name !== "string" ||
      !data.name.trim()
    ) {
      errors.push({
        field: "name",
        message: "Product name is required",
      });
    } else if (
      data.name.trim().length < 2 ||
      data.name.trim().length > 150
    ) {
      errors.push({
        field: "name",
        message:
          "Product name must be between 2 and 150 characters",
      });
    } else {
      value.name = data.name.trim();
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (
      typeof data.description !== "string" ||
      !data.description.trim()
    ) {
      errors.push({
        field: "description",
        message: "Product description is required",
      });
    } else if (data.description.length > 5000) {
      errors.push({
        field: "description",
        message:
          "Product description cannot exceed 5000 characters",
      });
    } else {
      value.description = data.description.trim();
    }
  }

  if (!isUpdate || data.sku !== undefined) {
    if (
      typeof data.sku !== "string" ||
      !data.sku.trim()
    ) {
      errors.push({
        field: "sku",
        message: "SKU is required",
      });
    } else if (
      !/^[A-Za-z0-9_-]{2,50}$/.test(
        data.sku.trim()
      )
    ) {
      errors.push({
        field: "sku",
        message:
          "SKU must contain only letters, numbers, hyphens or underscores",
      });
    } else {
      value.sku = data.sku.trim().toUpperCase();
    }
  }

  if (!isUpdate || data.category !== undefined) {
    if (
      !data.category ||
      !mongoose.Types.ObjectId.isValid(
        data.category
      )
    ) {
      errors.push({
        field: "category",
        message: "Valid category ID is required",
      });
    } else {
      value.category = data.category;
    }
  }

  if (!isUpdate || data.price !== undefined) {
    const price = Number(data.price);

    if (
      data.price === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      errors.push({
        field: "price",
        message:
          "Price must be a valid number greater than or equal to 0",
      });
    } else if (price > 999999999) {
      errors.push({
        field: "price",
        message: "Price is too large",
      });
    } else {
      value.price = Number(price.toFixed(2));
    }
  }

  if (!isUpdate || data.stock !== undefined) {
    const stock = Number(data.stock);

    if (
      data.stock === "" ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      errors.push({
        field: "stock",
        message:
          "Stock must be a whole number greater than or equal to 0",
      });
    } else {
      value.stock = stock;
    }
  }

  if (data.image !== undefined) {
    if (
      data.image !== null &&
      typeof data.image !== "string"
    ) {
      errors.push({
        field: "image",
        message: "Image must be a string",
      });
    } else if (
      typeof data.image === "string" &&
      data.image.length > 2000
    ) {
      errors.push({
        field: "image",
        message: "Image URL is too long",
      });
    } else {
      value.image = data.image?.trim() || null;
    }
  }

  if (!isUpdate || data.status !== undefined) {
    if (!PRODUCT_STATUSES.includes(data.status)) {
      errors.push({
        field: "status",
        message: `Status must be one of: ${PRODUCT_STATUSES.join(
          ", "
        )}`,
      });
    } else {
      value.status = data.status;
    }
  }

  return {
    value: {
      body: value,
    },
    errors,
  };
};

const createProductValidator = ({
  body,
}) => {
  return validateProductData(body, {
    isUpdate: false,
  });
};

const updateProductValidator = ({
  body,
}) => {
  if (!body || Object.keys(body).length === 0) {
    return {
      value: {
        body: {},
      },
      errors: [
        {
          field: "body",
          message:
            "At least one field is required for update",
        },
      ],
    };
  }

  return validateProductData(body, {
    isUpdate: true,
  });
};

module.exports = {
  createProductValidator,
  updateProductValidator,
  PRODUCT_STATUSES,
};