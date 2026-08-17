const Vendor = require("../models/Vendor");
const ApiError = require("../utils/ApiError");

const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const escapeRegex = (value) =>
  value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

const getVendors = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) => {
  const pagination = getPagination(page, limit);

  const filter = {};

  if (search?.trim()) {
    const regex = new RegExp(
      escapeRegex(search.trim()),
      "i"
    );

    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  if (status) {
    filter.status = status;
  }

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "name",
    "email",
    "commissionRate",
  ];

  const safeSortBy =
    allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

  const safeSortOrder =
    sortOrder === "asc" ? 1 : -1;

  const [vendors, total] = await Promise.all([
    Vendor.find(filter)
      .sort({
        [safeSortBy]: safeSortOrder,
      })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),

    Vendor.countDocuments(filter),
  ]);

  return {
    vendors,
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

const getVendorById = async (
  vendorId
) => {
  const vendor = await Vendor.findById(
    vendorId
  ).lean();

  if (!vendor) {
    throw new ApiError(
      404,
      "Vendor not found",
      "VENDOR_NOT_FOUND"
    );
  }

  return vendor;
};

const createVendor = async (
  vendorData
) => {
  const existingVendor =
    await Vendor.findOne({
      $or: [
        {
          email: vendorData.email
            ?.trim()
            .toLowerCase(),
        },
        {
          name: vendorData.name
            ?.trim(),
        },
      ],
    }).lean();

  if (existingVendor) {
    throw new ApiError(
      409,
      "Vendor with this name or email already exists",
      "VENDOR_ALREADY_EXISTS"
    );
  }

  const normalizedData = {
    ...vendorData,
    name: vendorData.name?.trim(),
    email: vendorData.email
      ?.trim()
      .toLowerCase(),
  };

  return Vendor.create(
    normalizedData
  );
};

const updateVendor = async (
  vendorId,
  updateData
) => {
  if (updateData.email) {
    updateData.email =
      updateData.email
        .trim()
        .toLowerCase();

    const existingVendor =
      await Vendor.findOne({
        email: updateData.email,
        _id: {
          $ne: vendorId,
        },
      }).lean();

    if (existingVendor) {
      throw new ApiError(
        409,
        "Email is already used by another vendor",
        "VENDOR_EMAIL_EXISTS"
      );
    }
  }

  if (updateData.commissionRate !== undefined) {
    const commissionRate = Number(
      updateData.commissionRate
    );

    if (
      !Number.isFinite(
        commissionRate
      ) ||
      commissionRate < 0 ||
      commissionRate > 100
    ) {
      throw new ApiError(
        400,
        "Commission rate must be between 0 and 100",
        "INVALID_COMMISSION_RATE"
      );
    }

    updateData.commissionRate =
      commissionRate;
  }

  const vendor =
    await Vendor.findByIdAndUpdate(
      vendorId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

  if (!vendor) {
    throw new ApiError(
      404,
      "Vendor not found",
      "VENDOR_NOT_FOUND"
    );
  }

  return vendor;
};

const updateVendorStatus = async (
  vendorId,
  status
) => {
  const allowedStatuses = [
    "Pending",
    "Approved",
    "Rejected",
    "Suspended",
    "Inactive",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid vendor status",
      "INVALID_VENDOR_STATUS"
    );
  }

  const vendor =
    await Vendor.findByIdAndUpdate(
      vendorId,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

  if (!vendor) {
    throw new ApiError(
      404,
      "Vendor not found",
      "VENDOR_NOT_FOUND"
    );
  }

  return vendor;
};

const approveVendor = async (
  vendorId
) => {
  return updateVendorStatus(
    vendorId,
    "Approved"
  );
};

const rejectVendor = async (
  vendorId
) => {
  return updateVendorStatus(
    vendorId,
    "Rejected"
  );
};

const deleteVendor = async (
  vendorId
) => {
  const vendor =
    await Vendor.findByIdAndDelete(
      vendorId
    ).lean();

  if (!vendor) {
    throw new ApiError(
      404,
      "Vendor not found",
      "VENDOR_NOT_FOUND"
    );
  }

  return vendor;
};

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  updateVendorStatus,
  approveVendor,
  rejectVendor,
  deleteVendor,
};