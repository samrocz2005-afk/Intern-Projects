const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");

const notificationService = require("../services/notificationService");
const Customer = require("../models/Customer");

/*
 * ==================================================
 * GET NOTIFICATIONS
 * ==================================================
 */

const getNotifications = asyncHandler(async (req, res) => {
  console.log("=================================");
  console.log("GET NOTIFICATIONS");
  console.log("AUTH USER:", req.user);
  console.log("QUERY:", req.query);
  console.log("=================================");

  const userRole = String(
    req.user?.role || ""
  ).toLowerCase();

  if (userRole === "admin") {
    const result =
      await notificationService.getAllNotifications({
        ...req.query,
      });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: result.notifications,
      pagination: result.pagination,
    });
  }

  if (userRole === "customer") {
    const authId =
      req.user?.id ||
      req.user?._id ||
      req.user?.userId ||
      req.user?.customerId;

    console.log("CUSTOMER AUTH ID:", authId);

    if (!authId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated customer ID is required",
        error: "CUSTOMER_ID_REQUIRED",
      });
    }

    let customer = null;

    if (mongoose.Types.ObjectId.isValid(authId)) {
      customer = await Customer.findById(authId)
        .select("_id firstName lastName email")
        .lean();
    }

    if (
      !customer &&
      req.user?.customerId &&
      mongoose.Types.ObjectId.isValid(req.user.customerId)
    ) {
      customer = await Customer.findById(req.user.customerId)
        .select("_id firstName lastName email")
        .lean();
    }

    if (!customer && mongoose.Types.ObjectId.isValid(authId)) {
      customer = await Customer.findOne({
        $or: [{ userId: authId }, { _id: authId }, { email: req.user?.email }]
      })
        .select("_id firstName lastName email")
        .lean();
    }

    // Fallback: If still not found, try matching by email directly from req.user
    if (!customer && req.user?.email) {
      customer = await Customer.findOne({ email: req.user.email })
        .select("_id firstName lastName email")
        .lean();
    }

    // AUTO-PROVISION: If the customer profile doesn't exist yet, create it automatically!
    if (!customer && req.user?.email) {
      const newCustomer = await Customer.create({
        _id: mongoose.Types.ObjectId.isValid(authId) ? authId : undefined,
        userId: authId,
        email: req.user.email,
        firstName: req.user.name || "Customer",
        lastName: "User",
      });
      customer = { _id: newCustomer._id };
    }

    if (!customer) {
      console.log("CUSTOMER DOCUMENT NOT FOUND");
      console.log("AUTH USER:", req.user);

      return res.status(404).json({
        success: false,
        message: "Customer account not found",
        error: "CUSTOMER_NOT_FOUND",
      });
    }

    const customerId = customer._id.toString();

    console.log("CUSTOMER MONGO ID:", customerId);

    const result =
      await notificationService.getNotifications({
        userId: customerId,
        userRole: "Customer",
        ...req.query,
      });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: result.notifications,
      pagination: result.pagination,
    });
  }

  if (userRole === "staff") {
    const staffId =
      req.user?.id ||
      req.user?._id ||
      req.user?.staffId;

    if (!staffId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated staff ID is required",
        error: "STAFF_ID_REQUIRED",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(staffId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid staff ID",
        error: "INVALID_ID",
      });
    }

    const result =
      await notificationService.getNotifications({
        userId: staffId,
        userRole: "Staff",
        ...req.query,
      });

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      data: result.notifications,
      pagination: result.pagination,
    });
  }

  return res.status(403).json({
    success: false,
    message: "Invalid notification user role",
    error: "INVALID_NOTIFICATION_ROLE",
  });
});

/*
 * ==================================================
 * CREATE NOTIFICATION
 * ==================================================
 */

const createNotification = asyncHandler(
  async (req, res) => {
    const userRole = String(
      req.user?.role || ""
    ).toLowerCase();

    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only Admin can create notifications",
        error: "ADMIN_ONLY",
      });
    }

    const {
      recipient,
      recipientModel,
      title,
      message,
      type,
      resourceId,
      resourceType,
    } = req.body;

    if (recipientModel !== "Customer") {
      return res.status(400).json({
        success: false,
        message:
          "Admin can create notifications only for customers",
        error: "INVALID_RECIPIENT_TYPE",
      });
    }

    if (!recipient) {
      return res.status(400).json({
        success: false,
        message: "Customer recipient is required",
        error: "RECIPIENT_REQUIRED",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(recipient)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
        error: "INVALID_RECIPIENT_ID",
      });
    }

    const customer =
      await Customer.findOne({
        $or: [{ _id: recipient }, { userId: recipient }]
      })
        .select("_id")
        .lean();

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        error: "CUSTOMER_NOT_FOUND",
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notification title is required",
        error: "TITLE_REQUIRED",
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Notification message is required",
        error: "MESSAGE_REQUIRED",
      });
    }

    const notification =
      await notificationService.createNotification({
        recipient: customer._id.toString(),
        recipientModel: "Customer",
        title: title.trim(),
        message: message.trim(),
        type: type || "Info",
        resourceId: resourceId || null,
        resourceType: resourceType || "",
      });

    return res.status(201).json({
      success: true,
      message: "Notification created successfully",
      data: notification,
    });
  }
);

/*
 * ==================================================
 * MARK SINGLE AS READ
 * ==================================================
 */

const markAsRead = asyncHandler(
  async (req, res) => {
    const userRole = String(
      req.user?.role || ""
    ).toLowerCase();

    if (userRole === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin cannot mark customer notifications as read",
        error:
          "ADMIN_NOTIFICATION_ACTION_NOT_ALLOWED",
      });
    }

    let userId;

    if (userRole === "customer") {
      const authId =
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        req.user?.customerId;

      if (!authId || !mongoose.Types.ObjectId.isValid(authId)) {
        return res.status(401).json({
          success: false,
          message: "Invalid customer ID",
          error: "INVALID_ID",
        });
      }

      let customer =
        await Customer.findOne({
          $or: [{ _id: authId }, { userId: authId }]
        })
          .select("_id")
          .lean();

      if (!customer && req.user?.email) {
        customer = await Customer.findOne({ email: req.user.email }).select("_id").lean();
      }

      if (!customer && req.user?.email) {
        const newCustomer = await Customer.create({
          _id: mongoose.Types.ObjectId.isValid(authId) ? authId : undefined,
          userId: authId,
          email: req.user.email,
          firstName: req.user.name || "Customer",
          lastName: "User",
        });
        customer = { _id: newCustomer._id };
      }

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
          error: "CUSTOMER_NOT_FOUND",
        });
      }

      userId = customer._id.toString();
    } else if (userRole === "staff") {
      userId =
        req.user?.id ||
        req.user?._id ||
        req.user?.staffId;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(401).json({
          success: false,
          message: "Invalid staff ID",
          error: "INVALID_ID",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid notification user role",
        error: "INVALID_NOTIFICATION_ROLE",
      });
    }

    const notification =
      await notificationService.markAsRead(
        req.params.id,
        userId,
        userRole === "customer"
          ? "Customer"
          : "Staff"
      );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  }
);

/*
 * ==================================================
 * MARK ALL AS READ
 * ==================================================
 */

const markAllAsRead = asyncHandler(
  async (req, res) => {
    const userRole = String(
      req.user?.role || ""
    ).toLowerCase();

    if (userRole === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin cannot mark customer notifications as read",
        error:
          "ADMIN_NOTIFICATION_ACTION_NOT_ALLOWED",
      });
    }

    let userId;

    if (userRole === "customer") {
      const authId =
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        req.user?.customerId;

      if (!authId || !mongoose.Types.ObjectId.isValid(authId)) {
        return res.status(401).json({
          success: false,
          message: "Invalid customer ID",
          error: "INVALID_ID",
        });
      }

      let customer =
        await Customer.findOne({
          $or: [{ _id: authId }, { userId: authId }]
        })
          .select("_id")
          .lean();

      if (!customer && req.user?.email) {
        customer = await Customer.findOne({ email: req.user.email }).select("_id").lean();
      }

      if (!customer && req.user?.email) {
        const newCustomer = await Customer.create({
          _id: mongoose.Types.ObjectId.isValid(authId) ? authId : undefined,
          userId: authId,
          email: req.user.email,
          firstName: req.user.name || "Customer",
          lastName: "User",
        });
        customer = { _id: newCustomer._id };
      }

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
          error: "CUSTOMER_NOT_FOUND",
        });
      }

      userId = customer._id.toString();
    } else if (userRole === "staff") {
      userId =
        req.user?.id ||
        req.user?._id ||
        req.user?.staffId;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(401).json({
          success: false,
          message: "Invalid staff ID",
          error: "INVALID_ID",
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid notification user role",
        error: "INVALID_NOTIFICATION_ROLE",
      });
    }

    const result =
      await notificationService.markAllAsRead(
        userId,
        userRole === "customer"
          ? "Customer"
          : "Staff"
      );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: result,
    });
  }
);

/*
 * ==================================================
 * DELETE NOTIFICATION
 * ==================================================
 */

const deleteNotification = asyncHandler(
  async (req, res) => {
    const userRole = String(
      req.user?.role || ""
    ).toLowerCase();

    if (userRole === "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin cannot delete customer notifications",
        error:
          "ADMIN_NOTIFICATION_ACTION_NOT_ALLOWED",
      });
    }

    let userId;

    if (userRole === "customer") {
      const authId =
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        req.user?.customerId;

      if (!authId || !mongoose.Types.ObjectId.isValid(authId)) {
        return res.status(401).json({
          success: false,
          message: "Invalid customer ID",
          error: "INVALID_ID",
        });
      }

      let customer =
        await Customer.findOne({
          $or: [{ _id: authId }, { userId: authId }]
        })
          .select("_id")
          .lean();

      if (!customer && req.user?.email) {
        customer = await Customer.findOne({ email: req.user.email }).select("_id").lean();
      }

      if (!customer && req.user?.email) {
        const newCustomer = await Customer.create({
          _id: mongoose.Types.ObjectId.isValid(authId) ? authId : undefined,
          userId: authId,
          email: req.user.email,
          firstName: req.user.name || "Customer",
          lastName: "User",
        });
        customer = { _id: newCustomer._id };
      }

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
          error: "CUSTOMER_NOT_FOUND",
        });
      }

      userId = customer._id.toString();
    } else if (userRole === "staff") {
      userId =
        req.user?.id ||
        req.user?._id ||
        req.user?.staffId;
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid notification user role",
        error: "INVALID_NOTIFICATION_ROLE",
      });
    }

    await notificationService.deleteNotification(
      req.params.id,
      userId,
      userRole === "customer"
        ? "Customer"
        : "Staff"
    );

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      data: null,
    });
  }
);

/*
 * ==================================================
 * GET NOTIFICATION BY ID
 * ==================================================
 */

const getNotificationById = asyncHandler(
  async (req, res) => {
    const userRole = String(
      req.user?.role || ""
    ).toLowerCase();

    /*
     * Validate notification ID
     */
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
        error: "INVALID_NOTIFICATION_ID",
      });
    }

    /*
     * Admin
     *
     * Admin can view notifications.
     */
    if (userRole === "admin") {
      const notification =
        await notificationService.getNotificationById(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
          error: "NOTIFICATION_NOT_FOUND",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notification fetched successfully",
        data: notification,
      });
    }

    /*
     * CUSTOMER
     */
    if (userRole === "customer") {
      const authId =
        req.user?.id ||
        req.user?._id ||
        req.user?.userId ||
        req.user?.customerId;

      if (
        !authId ||
        !mongoose.Types.ObjectId.isValid(authId)
      ) {
        return res.status(401).json({
          success: false,
          message: "Invalid customer ID",
          error: "INVALID_ID",
        });
      }

      let customer =
        await Customer.findOne({
          $or: [
            { _id: authId },
            { userId: authId },
          ],
        })
          .select("_id firstName lastName email")
          .lean();

      /*
       * Fallback by email
       */
      if (!customer && req.user?.email) {
        customer =
          await Customer.findOne({
            email: req.user.email,
          })
            .select(
              "_id firstName lastName email"
            )
            .lean();
      }

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer account not found",
          error: "CUSTOMER_NOT_FOUND",
        });
      }

      const notification =
        await notificationService.getNotificationById(
          req.params.id,
          customer._id.toString(),
          "Customer"
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
          error: "NOTIFICATION_NOT_FOUND",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notification fetched successfully",
        data: notification,
      });
    }

    /*
     * STAFF
     */
    if (userRole === "staff") {
      const staffId =
        req.user?.id ||
        req.user?._id ||
        req.user?.staffId;

      if (
        !staffId ||
        !mongoose.Types.ObjectId.isValid(staffId)
      ) {
        return res.status(401).json({
          success: false,
          message: "Invalid staff ID",
          error: "INVALID_ID",
        });
      }

      const notification =
        await notificationService.getNotificationById(
          req.params.id,
          staffId,
          "Staff"
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
          error: "NOTIFICATION_NOT_FOUND",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Notification fetched successfully",
        data: notification,
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid notification user role",
      error: "INVALID_NOTIFICATION_ROLE",
    });
  }
);

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};