const Discount = require("../models/Discount");
const ApiError = require("../utils/ApiError");

const getPagination = (
  page = 1,
  limit = 10
) => {
  const parsedPage = Math.max(
    Number(page) || 1,
    1
  );

  const parsedLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip:
      (parsedPage - 1) * parsedLimit,
  };
};

const escapeRegex = (value) =>
  value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

const getDiscounts = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  type,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const pagination =
    getPagination(page, limit);

  const filter = {};

  if (search?.trim()) {
    filter.code = {
      $regex: escapeRegex(
        search.trim()
      ),
      $options: "i",
    };
  }

  if (status) {
    filter.status = status;
  }

  if (type) {
    filter.type = type;
  }

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "code",
    "startDate",
    "endDate",
    "value",
  ];

  const safeSortBy =
    allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

  const safeSortOrder =
    sortOrder === "asc" ? 1 : -1;

  const [discounts, total] =
    await Promise.all([
      Discount.find(filter)
        .sort({
          [safeSortBy]: safeSortOrder,
        })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),

      Discount.countDocuments(filter),
    ]);

  return {
    discounts,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages: Math.ceil(
        total / pagination.limit
      ),
    },
  };
};

const getDiscountById = async (
  discountId
) => {
  const discount =
    await Discount.findById(
      discountId
    ).lean();

  if (!discount) {
    throw new ApiError(
      404,
      "Discount not found",
      "DISCOUNT_NOT_FOUND"
    );
  }

  return discount;
};

const createDiscount = async (
  discountData
) => {
  if (discountData.code) {
    discountData.code =
      discountData.code
        .trim()
        .toUpperCase();

    const existingDiscount =
      await Discount.findOne({
        code: discountData.code,
      }).lean();

    if (existingDiscount) {
      throw new ApiError(
        409,
        "Discount code already exists",
        "DISCOUNT_CODE_EXISTS"
      );
    }
  }

  return Discount.create(
    discountData
  );
};

const updateDiscount = async (
  discountId,
  updateData
) => {
  if (updateData.code) {
    updateData.code =
      updateData.code
        .trim()
        .toUpperCase();

    const existingDiscount =
      await Discount.findOne({
        code: updateData.code,
        _id: {
          $ne: discountId,
        },
      }).lean();

    if (existingDiscount) {
      throw new ApiError(
        409,
        "Discount code already exists",
        "DISCOUNT_CODE_EXISTS"
      );
    }
  }

  const discount =
    await Discount.findByIdAndUpdate(
      discountId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

  if (!discount) {
    throw new ApiError(
      404,
      "Discount not found",
      "DISCOUNT_NOT_FOUND"
    );
  }

  return discount;
};

const deleteDiscount = async (
  discountId
) => {
  const discount =
    await Discount.findByIdAndDelete(
      discountId
    ).lean();

  if (!discount) {
    throw new ApiError(
      404,
      "Discount not found",
      "DISCOUNT_NOT_FOUND"
    );
  }

  return discount;
};

const validateCoupon = async (
  code,
  orderValue = 0
) => {
  const normalizedCode =
    code?.trim().toUpperCase();

  if (!normalizedCode) {
    throw new ApiError(
      400,
      "Coupon code is required",
      "COUPON_CODE_REQUIRED"
    );
  }

  const discount =
    await Discount.findOne({
      code: normalizedCode,
      status: "Active",
    }).lean();

  if (!discount) {
    throw new ApiError(
      404,
      "Invalid or inactive coupon",
      "INVALID_COUPON"
    );
  }

  const now = new Date();

  if (
    discount.startDate &&
    now < discount.startDate
  ) {
    throw new ApiError(
      400,
      "Coupon is not active yet",
      "COUPON_NOT_STARTED"
    );
  }

  if (
    discount.endDate &&
    now > discount.endDate
  ) {
    throw new ApiError(
      400,
      "Coupon has expired",
      "COUPON_EXPIRED"
    );
  }

  if (
    discount.minimumOrderValue &&
    orderValue <
      discount.minimumOrderValue
  ) {
    throw new ApiError(
      400,
      `Minimum order value is ${discount.minimumOrderValue}`,
      "MINIMUM_ORDER_VALUE_NOT_MET"
    );
  }

  let discountAmount = 0;

  if (discount.type === "percentage") {
    discountAmount =
      (orderValue * discount.value) /
      100;

    if (
      discount.maximumDiscount &&
      discountAmount >
        discount.maximumDiscount
    ) {
      discountAmount =
        discount.maximumDiscount;
    }
  } else {
    discountAmount =
      discount.value;
  }

  discountAmount = Math.min(
    discountAmount,
    orderValue
  );

  return {
    discount,
    discountAmount: Number(
      discountAmount.toFixed(2)
    ),
    finalAmount: Number(
      (orderValue - discountAmount).toFixed(
        2
      )
    ),
  };
};

module.exports = {
  getDiscounts,
  getDiscountById,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  validateCoupon,
};