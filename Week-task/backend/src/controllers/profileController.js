const Customer = require("../models/Customer");

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    const userEmail = req.user?.email;
    const userName = req.user?.name || "User";

    let customer = null;

    // 1. Try finding by ID if it's a valid 24-character Mongo ID
    if (userId && userId !== "env-admin-id" && userId.length === 24) {
      customer = await Customer.findById(userId).lean();
    }

    // 2. Fallback: Try finding by email
    if (!customer && userEmail) {
      customer = await Customer.findOne({ email: userEmail }).lean();
    }

    // 3. Fallback: Try finding by name
    if (!customer && userName) {
      customer = await Customer.findOne({ 
        firstName: { $regex: new RegExp(`^${userName}$`, "i") } 
      }).lean();
    }

    // 4. Auto-create the customer profile in MongoDB if it doesn't exist yet
    if (!customer) {
      const nameParts = userName.trim().split(" ");
      customer = await Customer.create({
        firstName: nameParts[0] || "User",
        lastName: nameParts.slice(1).join(" ") || "Account",
        email: userEmail || `${userName.toLowerCase()}@example.com`,
        phone: "",
        status: "Active",
      });
      customer = customer.toObject();
    }

    res.status(200).json({
      success: true,
      data: {
        name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
        email: customer.email,
        phone: customer.phone || "",
        address: customer.address || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    
    // Identify the existing record by session or matching names/emails
    const identifier = req.user?.email || req.user?.name || "kalaimani";

    const nameParts = (name || "").trim().split(" ");
    const firstName = nameParts[0] || "Kalaimani";
    const lastName = nameParts.slice(1).join(" ") || "";

    //findOneAndUpdate WITHOUT upsert: true ensures it only updates existing data
    const updatedCustomer = await Customer.findOneAndUpdate(
      {
        $or: [
          { email: identifier },
          { firstName: { $regex: new RegExp(`^${identifier}$`, "i") } }
        ]
      },
      {
        $set: {
          firstName,
          lastName,
          email: email || identifier,
          phone,
          ...(address && { address }),
        }
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Existing customer profile not found to update.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: `${updatedCustomer.firstName} ${updatedCustomer.lastName}`.trim(),
        email: updatedCustomer.email,
        phone: updatedCustomer.phone || "",
        address: updatedCustomer.address || {},
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};