const SupportTicket = require("../models/SupportTicket");
const Customer = require("../models/Customer");
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

const getTickets = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  priority,
  customer,
} = {}) => {
  const pagination =
    getPagination(page, limit);

  const filter = {};

  if (search?.trim()) {
    filter.$or = [
      {
        subject: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        ticketNumber: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  if (customer) {
    filter.customer = customer;
  }

  const [tickets, total] =
    await Promise.all([
      SupportTicket.find(filter)
        .populate(
          "customer",
          "_id firstName lastName email"
        )
        .populate(
          "assignedTo",
          "_id firstName lastName email"
        )
        .sort({
          createdAt: -1,
        })
        .skip(pagination.skip)
        .limit(pagination.limit)
        .lean(),

      SupportTicket.countDocuments(
        filter
      ),
    ]);

  return {
    tickets,
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

const getTicketById = async (
  ticketId
) => {
  const ticket =
    await SupportTicket.findById(
      ticketId
    )
      .populate(
        "customer",
        "_id firstName lastName email phone"
      )
      .populate(
        "assignedTo",
        "_id firstName lastName email role"
      )
      .lean();

  if (!ticket) {
    throw new ApiError(
      404,
      "Support ticket not found",
      "SUPPORT_TICKET_NOT_FOUND"
    );
  }

  return ticket;
};

const createTicket = async (
  ticketData
) => {
  const customerExists =
    await Customer.exists({
      _id: ticketData.customer,
    });

  if (!customerExists) {
    throw new ApiError(
      404,
      "Customer not found",
      "CUSTOMER_NOT_FOUND"
    );
  }

  const ticketNumber =
    `TKT-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;

  const ticket =
    await SupportTicket.create({
      ...ticketData,
      ticketNumber,
    });

  return ticket;
};

const updateTicket = async (
  ticketId,
  updateData
) => {
  const ticket =
    await SupportTicket.findByIdAndUpdate(
      ticketId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "customer",
        "_id firstName lastName email"
      )
      .populate(
        "assignedTo",
        "_id firstName lastName email"
      )
      .lean();

  if (!ticket) {
    throw new ApiError(
      404,
      "Support ticket not found",
      "SUPPORT_TICKET_NOT_FOUND"
    );
  }

  return ticket;
};

const updateTicketStatus = async (
  ticketId,
  status
) => {
  const allowedStatuses = [
    "Open",
    "In Progress",
    "Pending",
    "Resolved",
    "Closed",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(
      400,
      "Invalid support ticket status",
      "INVALID_TICKET_STATUS"
    );
  }

  const ticket =
    await SupportTicket.findByIdAndUpdate(
      ticketId,
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

  if (!ticket) {
    throw new ApiError(
      404,
      "Support ticket not found",
      "SUPPORT_TICKET_NOT_FOUND"
    );
  }

  return ticket;
};

const assignTicket = async (
  ticketId,
  staffId
) => {
  const ticket =
    await SupportTicket.findByIdAndUpdate(
      ticketId,
      {
        $set: {
          assignedTo: staffId,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "assignedTo",
        "_id firstName lastName email role"
      )
      .lean();

  if (!ticket) {
    throw new ApiError(
      404,
      "Support ticket not found",
      "SUPPORT_TICKET_NOT_FOUND"
    );
  }

  return ticket;
};

const addMessage = async (
  ticketId,
  messageData
) => {
  if (
    !messageData.message ||
    !messageData.message.trim()
  ) {
    throw new ApiError(
      400,
      "Support message is required",
      "MESSAGE_REQUIRED"
    );
  }

  const ticket =
    await SupportTicket.findById(
      ticketId
    );

  if (!ticket) {
    throw new ApiError(
      404,
      "Support ticket not found",
      "SUPPORT_TICKET_NOT_FOUND"
    );
  }

  ticket.messages.push({
    sender: messageData.sender,
    senderType:
      messageData.senderType,
    message:
      messageData.message.trim(),
    createdAt: new Date(),
  });

  /*
   * Re-open a resolved/closed ticket
   * when a new customer/support message
   * is added, if your business flow requires it.
   */
  if (
    ticket.status === "Closed"
  ) {
    ticket.status = "Open";
  }

  await ticket.save();

  return ticket;
};

const deleteTicket = async (
  ticketId
) => {
  const ticket =
    await SupportTicket.findByIdAndDelete(
      ticketId
    ).lean();

  if (!ticket) {
    throw new ApiError(
      404,
      "Support ticket not found",
      "SUPPORT_TICKET_NOT_FOUND"
    );
  }

  return ticket;
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  updateTicketStatus,
  assignTicket,
  addMessage,
  deleteTicket,
};