const mongoose = require("mongoose");

const Notification = require("../models/Notification");
const ApiError = require("../utils/ApiError");

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/*
 * ==================================================
 * HELPERS
 * ==================================================
 */

const validateId = (id, fieldName = "ID") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,
      `Invalid ${fieldName}`,
      "INVALID_ID"
    );
  }
};

const validateNotificationId = (id) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(
      400,
      "Invalid notification ID",
      "INVALID_NOTIFICATION_ID"
    );
  }
};

const getPagination = (page, limit) => {
  const parsedPage = Math.max(
    Number.parseInt(page, 10) || DEFAULT_PAGE,
    1
  );

  const parsedLimit = Math.min(
    Math.max(
      Number.parseInt(limit, 10) || DEFAULT_LIMIT,
      1
    ),
    MAX_LIMIT
  );

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip: (parsedPage - 1) * parsedLimit,
  };
};

const getRecipientModel = (role) => {
  const normalizedRole = String(role || "").toLowerCase();

  if (normalizedRole === "customer") {
    return "Customer";
  }

  if (
    normalizedRole === "staff" ||
    normalizedRole === "admin"
  ) {
    return "Staff";
  }

  throw new ApiError(
    403,
    "Invalid notification user role",
    "INVALID_NOTIFICATION_ROLE"
  );
};

/*
 * ==================================================
 * GET CUSTOMER / STAFF NOTIFICATIONS
 * ==================================================
 */

const getNotifications = async ({
  userId,
  userRole,
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  isRead,
} = {}) => {
  /*
   * Admin uses getAllNotifications().
   */
  if (
    String(userRole || "").toLowerCase() === "admin"
  ) {
    throw new ApiError(
      400,
      "Admin must use the admin notification query",
      "ADMIN_NOTIFICATION_QUERY"
    );
  }

  /*
   * IMPORTANT:
   * This MUST be the MongoDB Customer._id
   * for Customer users.
   */
  validateId(userId, "user ID");

  const recipientModel =
    getRecipientModel(userRole);

  const {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  } = getPagination(page, limit);

  const filter = {
    recipient: new mongoose.Types.ObjectId(userId),
    recipientModel,
  };

  /*
   * isRead filter
   */
  if (typeof isRead !== "undefined") {
    if (
      isRead === true ||
      isRead === "true"
    ) {
      filter.isRead = true;
    } else if (
      isRead === false ||
      isRead === "false"
    ) {
      filter.isRead = false;
    } else {
      throw new ApiError(
        400,
        "isRead must be true or false",
        "INVALID_READ_FILTER"
      );
    }
  }

  console.log(
    "================================="
  );
  console.log(
    "CUSTOMER/STAFF NOTIFICATION QUERY"
  );
  console.log("userId:", userId);
  console.log("userRole:", userRole);
  console.log(
    "recipientModel:",
    recipientModel
  );
  console.log("filter:", filter);
  console.log(
    "================================="
  );

  const [
    notifications,
    total,
  ] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),

    Notification.countDocuments(filter),
  ]);

  console.log(
    "NOTIFICATIONS FOUND:",
    notifications.length
  );

  return {
    notifications,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(
        total / parsedLimit
      ),
    },
  };
};

/*
 * ==================================================
 * GET ALL NOTIFICATIONS - ADMIN ONLY
 * ==================================================
 */

const getAllNotifications = async ({
  page = DEFAULT_PAGE,
  limit = DEFAULT_LIMIT,
  isRead,
  recipientModel,
} = {}) => {
  const {
    page: parsedPage,
    limit: parsedLimit,
    skip,
  } = getPagination(page, limit);

  const filter = {};

  if (typeof isRead !== "undefined") {
    if (
      isRead === true ||
      isRead === "true"
    ) {
      filter.isRead = true;
    } else if (
      isRead === false ||
      isRead === "false"
    ) {
      filter.isRead = false;
    } else {
      throw new ApiError(
        400,
        "isRead must be true or false",
        "INVALID_READ_FILTER"
      );
    }
  }

  if (recipientModel) {
    if (
      !["Customer", "Staff"].includes(
        recipientModel
      )
    ) {
      throw new ApiError(
        400,
        "Invalid notification recipient type",
        "INVALID_RECIPIENT_TYPE"
      );
    }

    filter.recipientModel =
      recipientModel;
  }

  const [
    notifications,
    total,
  ] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit)
      .lean(),

    Notification.countDocuments(filter),
  ]);

  return {
    notifications,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(
        total / parsedLimit
      ),
    },
  };
};

/*
 * ==================================================
 * CREATE NOTIFICATION
 * ==================================================
 *
 * ADMIN -> CUSTOMER ONLY
 * ==================================================
 */

const createNotification = async ({
  recipient,
  recipientModel,
  title,
  message,
  type = "Info",
  resourceId,
  resourceType,
}) => {
  validateId(recipient, "recipient ID");

  if (recipientModel !== "Customer") {
    throw new ApiError(
      400,
      "Admin can create notifications only for customers",
      "INVALID_RECIPIENT_TYPE"
    );
  }

  if (!title?.trim()) {
    throw new ApiError(
      400,
      "Notification title is required",
      "TITLE_REQUIRED"
    );
  }

  if (!message?.trim()) {
    throw new ApiError(
      400,
      "Notification message is required",
      "MESSAGE_REQUIRED"
    );
  }

  const allowedTypes = [
    "Info",
    "Success",
    "Warning",
    "Error",
    "Order",
    "Inventory",
    "Payment",
    "System",
  ];

  if (!allowedTypes.includes(type)) {
    throw new ApiError(
      400,
      "Invalid notification type",
      "INVALID_NOTIFICATION_TYPE"
    );
  }

  const notification =
    await Notification.create({
      recipient:
        new mongoose.Types.ObjectId(
          recipient
        ),

      recipientModel: "Customer",

      title: title.trim(),

      message: message.trim(),

      type,

      resourceId:
        resourceId || null,

      resourceType:
        resourceType?.trim() || "",

      isRead: false,

      readAt: null,
    });

  return notification.toObject();
};

/*
 * ==================================================
 * MARK SINGLE AS READ
 * ==================================================
 */

const markAsRead = async (
  notificationId,
  userId,
  userRole
) => {
  validateNotificationId(
    notificationId
  );

  if (
    String(userRole || "").toLowerCase() ===
    "admin"
  ) {
    throw new ApiError(
      403,
      "Admin cannot mark customer notifications as read",
      "ADMIN_NOTIFICATION_ACTION_NOT_ALLOWED"
    );
  }

  validateId(userId, "user ID");

  const recipientModel =
    getRecipientModel(userRole);

  const notification =
    await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        recipient:
          new mongoose.Types.ObjectId(
            userId
          ),
        recipientModel,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

  if (!notification) {
    throw new ApiError(
      404,
      "Notification not found",
      "NOTIFICATION_NOT_FOUND"
    );
  }

  return notification;
};

/*
 * ==================================================
 * MARK ALL AS READ
 * ==================================================
 */

const markAllAsRead = async (
  userId,
  userRole
) => {
  if (
    String(userRole || "").toLowerCase() ===
    "admin"
  ) {
    throw new ApiError(
      403,
      "Admin cannot mark customer notifications as read",
      "ADMIN_NOTIFICATION_ACTION_NOT_ALLOWED"
    );
  }

  validateId(userId, "user ID");

  const recipientModel =
    getRecipientModel(userRole);

  const result =
    await Notification.updateMany(
      {
        recipient:
          new mongoose.Types.ObjectId(
            userId
          ),
        recipientModel,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
          readAt: new Date(),
        },
      }
    );

  return {
    modifiedCount:
      result.modifiedCount || 0,
  };
};

/*
 * ==================================================
 * DELETE NOTIFICATION
 * ==================================================
 */

const deleteNotification = async (
  notificationId,
  userId,
  userRole
) => {
  validateNotificationId(
    notificationId
  );

  if (
    String(userRole || "").toLowerCase() ===
    "admin"
  ) {
    throw new ApiError(
      403,
      "Admin cannot delete customer notifications",
      "ADMIN_NOTIFICATION_ACTION_NOT_ALLOWED"
    );
  }

  validateId(userId, "user ID");

  const recipientModel =
    getRecipientModel(userRole);

  const notification =
    await Notification.findOneAndDelete({
      _id: notificationId,
      recipient:
        new mongoose.Types.ObjectId(
          userId
        ),
      recipientModel,
    });

  if (!notification) {
    throw new ApiError(
      404,
      "Notification not found",
      "NOTIFICATION_NOT_FOUND"
    );
  }

  return notification.toObject();
};

/*
 * ==================================================
 * UNREAD COUNT
 * ==================================================
 */

const getUnreadCount = async (
  userId,
  userRole
) => {
  if (
    String(userRole || "").toLowerCase() ===
    "admin"
  ) {
    return Notification.countDocuments({
      isRead: false,
    });
  }

  validateId(userId, "user ID");

  const recipientModel =
    getRecipientModel(userRole);

  return Notification.countDocuments({
    recipient:
      new mongoose.Types.ObjectId(userId),
    recipientModel,
    isRead: false,
  });
};

/*
 * ==================================================
 * GET NOTIFICATION BY ID
 * ==================================================
 */

const getNotificationById = async (
  notificationId,
  userId = null,
  userRole = null
) => {
  const Notification = require("../models/Notification");
  const Customer = require("../models/Customer");
  const Staff = require("../models/Staff");

  /*
   * Admin can view any notification.
   */
  if (
    userRole === null ||
    userRole === undefined
  ) {
    return Notification.findById(
      notificationId
    ).lean();
  }

  /*
   * Customer / Staff can only view
   * their own notification.
   */
  const query = {
    _id: notificationId,
  };

  if (userId && userRole) {
    query.recipient = userId;
    query.recipientModel = userRole;
  }

  const notification =
    await Notification.findOne(query).lean();

  if (!notification) {
    return null;
  }

  /*
   * Populate recipient manually because
   * recipient can reference Customer OR Staff.
   */
  if (
    notification.recipient &&
    notification.recipientModel === "Customer"
  ) {
    const customer =
      await Customer.findById(
        notification.recipient
      )
        .select(
          "_id firstName lastName email"
        )
        .lean();

    notification.recipient = customer;
  }

  if (
    notification.recipient &&
    notification.recipientModel === "Staff"
  ) {
    const staff =
      await Staff.findById(
        notification.recipient
      )
        .select(
          "_id firstName lastName email role"
        )
        .lean();

    notification.recipient = staff;
  }

  return notification;
};

module.exports = {
  getNotifications,
  getAllNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  getNotificationById,
};