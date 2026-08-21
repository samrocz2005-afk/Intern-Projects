const Storage = require("../models/Storage");
const Instance = require("../models/Instance");

// Create storage
const createStorage = async (userId, data) => {
  const {
    name,
    size,
    type,
    encrypted,
    hourlyPrice,
  } = data;

  const existingStorage = await Storage.findOne({
    owner: userId,
    name: name.trim(),
  });

  if (existingStorage) {
    const error = new Error(
      "Storage with this name already exists"
    );

    error.statusCode = 409;
    throw error;
  }

  const storage = await Storage.create({
    owner: userId,
    name,
    size,
    type,
    encrypted,
    hourlyPrice,
    status: "available",
  });

  return storage;
};

// Get user's storage
const getUserStorage = async (
  userId,
  filters = {}
) => {
  const query = {
    owner: userId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  return Storage.find(query)
    .populate(
      "instance",
      "name status ipAddress"
    )
    .sort({
      createdAt: -1,
    });
};

// Get storage by ID
const getStorageById = async (
  storageId,
  userId
) => {
  const storage = await Storage.findOne({
    _id: storageId,
    owner: userId,
  }).populate(
    "instance",
    "name status ipAddress"
  );

  if (!storage) {
    const error = new Error(
      "Storage not found or you do not have access to it"
    );

    error.statusCode = 404;
    throw error;
  }

  return storage;
};

// Attach storage to instance
const attachStorage = async (
  storageId,
  instanceId,
  userId
) => {
  const storage = await Storage.findOne({
    _id: storageId,
    owner: userId,
  });

  if (!storage) {
    const error = new Error("Storage not found");
    error.statusCode = 404;
    throw error;
  }

  if (storage.status !== "available") {
    const error = new Error(
      "Storage is not available for attachment"
    );

    error.statusCode = 400;
    throw error;
  }

  const instance = await Instance.findOne({
    _id: instanceId,
    owner: userId,
  });

  if (!instance) {
    const error = new Error(
      "Instance not found or you do not have access to it"
    );

    error.statusCode = 404;
    throw error;
  }

  if (instance.status === "terminated") {
    const error = new Error(
      "Cannot attach storage to a terminated instance"
    );

    error.statusCode = 400;
    throw error;
  }

  storage.status = "attaching";

  await storage.save();

  // Simulated attachment operation
  storage.instance = instance._id;
  storage.status = "attached";
  storage.attachedAt = new Date();

  // Example mount point
  storage.mountPoint = `/dev/sd${String.fromCharCode(
    98 + Math.floor(Math.random() * 20)
  )}`;

  await storage.save();

  return Storage.findById(storage._id).populate(
    "instance",
    "name status ipAddress"
  );
};

// Detach storage
const detachStorage = async (
  storageId,
  userId
) => {
  const storage = await Storage.findOne({
    _id: storageId,
    owner: userId,
  });

  if (!storage) {
    const error = new Error("Storage not found");
    error.statusCode = 404;
    throw error;
  }

  if (storage.status !== "attached") {
    const error = new Error(
      "Storage is not currently attached"
    );

    error.statusCode = 400;
    throw error;
  }

  storage.status = "detaching";

  await storage.save();

  // Simulated detach operation
  storage.instance = null;
  storage.mountPoint = null;
  storage.status = "available";
  storage.detachedAt = new Date();

  await storage.save();

  return storage;
};

// Update storage
const updateStorage = async (
  storageId,
  userId,
  data
) => {
  const storage = await Storage.findOne({
    _id: storageId,
    owner: userId,
  });

  if (!storage) {
    const error = new Error("Storage not found");
    error.statusCode = 404;
    throw error;
  }

  // Don't allow size reduction
  if (
    data.size !== undefined &&
    data.size < storage.size
  ) {
    const error = new Error(
      "Storage size cannot be reduced"
    );

    error.statusCode = 400;
    throw error;
  }

  if (data.name !== undefined) {
    storage.name = data.name;
  }

  if (data.size !== undefined) {
    storage.size = data.size;
  }

  if (data.type !== undefined) {
    storage.type = data.type;
  }

  await storage.save();

  return storage;
};

// Delete storage
const deleteStorage = async (
  storageId,
  userId
) => {
  const storage = await Storage.findOne({
    _id: storageId,
    owner: userId,
  });

  if (!storage) {
    const error = new Error("Storage not found");
    error.statusCode = 404;
    throw error;
  }

  if (storage.status === "attached") {
    const error = new Error(
      "Detach storage before deleting it"
    );

    error.statusCode = 400;
    throw error;
  }

  await Storage.findByIdAndDelete(storageId);

  return {
    message: "Storage deleted successfully",
  };
};

module.exports = {
  createStorage,
  getUserStorage,
  getStorageById,
  attachStorage,
  detachStorage,
  updateStorage,
  deleteStorage,
};