const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Staff = require("../models/Staff");
const ApiError = require("../utils/ApiError");

const SALT_ROUNDS = 12;

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

const sanitizeStaff = (staff) => {
  if (!staff) {
    return null;
  }

  const result =
    typeof staff.toObject ===
    "function"
      ? staff.toObject()
      : { ...staff };

  delete result.password;
  delete result.passwordHash;
  delete result.resetToken;
  delete result.resetTokenExpiry;

  return result;
};

const getStaff = async ({
  page = 1,
  limit = 10,
  search = "",
  role,
  status,
} = {}) => {
  const pagination =
    getPagination(page, limit);

  const filter = {};

  if (search?.trim()) {
    filter.$or = [
      {
        firstName: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        email: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (status) {
    filter.status = status;
  }

  const [staff, total] =
    await Promise.all([
      Staff.find(filter)
        .select(
          "-password -passwordHash -resetToken -resetTokenExpiry"
        )
        .sort({
          createdAt: -1,
        })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),

      Staff.countDocuments(filter),
    ]);

  return {
    staff,
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

const getStaffById = async (
  staffId
) => {
  const staff = await Staff.findById(
    staffId
  )
    .select(
      "-password -passwordHash -resetToken -resetTokenExpiry"
    )
    .lean();

  if (!staff) {
    throw new ApiError(
      404,
      "Staff member not found",
      "STAFF_NOT_FOUND"
    );
  }

  return staff;
};

const createStaff = async (
  staffData
) => {
  const email =
    staffData.email
      ?.trim()
      .toLowerCase();

  const existingStaff =
    await Staff.findOne({
      email,
    }).lean();

  if (existingStaff) {
    throw new ApiError(
      409,
      "Staff email already exists",
      "STAFF_EMAIL_EXISTS"
    );
  }

  const rawPassword = staffData.password || "Password@123";

  const passwordHash =
    await bcrypt.hash(
      rawPassword,
      SALT_ROUNDS
    );

  const staff =
    await Staff.create({
      ...staffData,
      email,
      password: passwordHash,
    });

  return sanitizeStaff(staff);
};

const updateStaff = async (
  staffId,
  updateData
) => {
  const staff =
    await Staff.findById(
      staffId
    );

  if (!staff) {
    throw new ApiError(
      404,
      "Staff member not found",
      "STAFF_NOT_FOUND"
    );
  }

  if (updateData.email) {
    const email =
      updateData.email
        .trim()
        .toLowerCase();

    const existingStaff =
      await Staff.findOne({
        email,
        _id: {
          $ne: staffId,
        },
      }).lean();

    if (existingStaff) {
      throw new ApiError(
        409,
        "Staff email already exists",
        "STAFF_EMAIL_EXISTS"
      );
    }

    staff.email = email;
  }

  if (updateData.password) {
    staff.password =
      await bcrypt.hash(
        updateData.password,
        SALT_ROUNDS
      );
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "role",
    "permissions",
    "status",
  ];

  for (const field of allowedFields) {
    if (
      updateData[field] !== undefined
    ) {
      staff[field] =
        updateData[field];
    }
  }

  await staff.save();

  return sanitizeStaff(staff);
};

const deleteStaff = async (
  staffId,
  currentUserId
) => {
  if (
    currentUserId &&
    staffId.toString() ===
      currentUserId.toString()
  ) {
    throw new ApiError(
      400,
      "You cannot delete your own account",
      "SELF_DELETE_NOT_ALLOWED"
    );
  }

  const staff =
    await Staff.findByIdAndDelete(
      staffId
    ).lean();

  if (!staff) {
    throw new ApiError(
      404,
      "Staff member not found",
      "STAFF_NOT_FOUND"
    );
  }

  return sanitizeStaff(staff);
};

const login = async (
  email,
  password
) => {
  const normalizedEmail =
    email?.trim().toLowerCase();

  const staff =
    await Staff.findOne({
      email: normalizedEmail,
    });

  if (!staff) {
    throw new ApiError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  if (staff.status !== "Active") {
    throw new ApiError(
      403,
      "Staff account is inactive",
      "STAFF_INACTIVE"
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      staff.password
    );

  if (!passwordMatches) {
    throw new ApiError(
      401,
      "Invalid email or password",
      "INVALID_CREDENTIALS"
    );
  }

  const token = jwt.sign(
    {
      id: staff._id.toString(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        "1d",
    }
  );

  return {
    token,
    staff: sanitizeStaff(staff),
  };
};

const updateStaffRole = async (
  staffId,
  role
) => {
  const allowedRoles = [
    "Admin",
    "Manager",
    "Staff",
    "Support",
  ];

  if (!allowedRoles.includes(role)) {
    throw new ApiError(
      400,
      "Invalid staff role",
      "INVALID_STAFF_ROLE"
    );
  }

  const staff =
    await Staff.findByIdAndUpdate(
      staffId,
      {
        $set: {
          role,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select(
        "-password -passwordHash -resetToken -resetTokenExpiry"
      )
      .lean();

  if (!staff) {
    throw new ApiError(
      404,
      "Staff member not found",
      "STAFF_NOT_FOUND"
    );
  }

  return staff;
};

module.exports = {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  login,
  updateStaffRole,
};