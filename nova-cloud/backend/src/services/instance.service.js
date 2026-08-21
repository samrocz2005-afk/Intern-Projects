const Instance = require("../models/Instance");
const Flavor = require("../models/Flavor");
const Network = require("../models/Network");

// Create instance
const createInstance = async (userId, data) => {
  const {
    name,
    flavor,
    network,
    operatingSystem,
    sshKeyName,
  } = data;

  // Check flavor
  const flavorData = await Flavor.findOne({
    _id: flavor,
    isActive: true,
  });

  if (!flavorData) {
    const error = new Error(
      "Flavor not found or inactive"
    );
    error.statusCode = 404;
    throw error;
  }

  // Check network ownership
  if (network) {
    const networkData = await Network.findOne({
        _id: network,
        status: "active",
    });

    if (!networkData) {
        const error = new Error(
        "Network not found or network is not active"
        );

        error.statusCode = 404;
        throw error;
    }
    }

  const instance = await Instance.create({
    name,
    owner: userId,
    flavor: flavorData._id,
    network: network || null,
    operatingSystem,
    sshKeyName: sshKeyName || null,
    status: "running",
  });

  return Instance.findById(instance._id)
    .populate("owner", "name email")
    .populate("flavor")
    .populate("network");
};

// Get user's instances
const getUserInstances = async (
  userId,
  filters = {}
) => {
  const query = {
    owner: userId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  return Instance.find(query)
    .populate("owner", "name email")
    .populate("flavor")
    .populate("network")
    .sort({
      createdAt: -1,
    });
};

// Get single instance
const getInstanceById = async (
  instanceId,
  userId,
  isAdmin = false
) => {
  const query = {
    _id: instanceId,
  };

  /*
   * Admin can view any instance.
   * Normal users can only view their own instance.
   */
  if (!isAdmin) {
    query.owner = userId;
  }

  const instance = await Instance.findOne(query)
    .populate("owner", "name email")
    .populate("flavor")
    .populate("network");

  if (!instance) {
    const error = new Error(
      "Instance not found"
    );

    error.statusCode = 404;
    throw error;
  }

  return instance;
};

// Start instance
const startInstance = async (
  instanceId,
  userId
) => {
  const instance = await Instance.findOne({
    _id: instanceId,
    owner: userId,
  });

  if (!instance) {
    const error = new Error(
      "Instance not found"
    );
    error.statusCode = 404;
    throw error;
  }

  if (instance.status === "running") {
    const error = new Error(
      "Instance is already running"
    );
    error.statusCode = 400;
    throw error;
  }

  if (instance.status === "terminated") {
    const error = new Error(
      "Terminated instance cannot be started"
    );

    error.statusCode = 400;
    throw error;
  }

  instance.status = "running";

  // Start billing session
  instance.currentSessionStartedAt =
    new Date();

  instance.startedAt = new Date();

  await instance.save();

  return instance
    .populate("owner", "name email")
    .then((result) =>
      result.populate("flavor")
    )
    .then((result) =>
      result.populate("network")
    );
};

// Stop instance
const stopInstance = async (
  instanceId,
  userId
) => {
  const instance = await Instance.findOne({
    _id: instanceId,
    owner: userId,
  });

  if (!instance) {
    const error = new Error(
      "Instance not found"
    );
    error.statusCode = 404;
    throw error;
  }

  if (instance.status !== "running") {
    const error = new Error(
      "Instance is not running"
    );
    error.statusCode = 400;
    throw error;
  }

  // Calculate current running session
  if (instance.currentSessionStartedAt) {
    const sessionSeconds =
      (Date.now() -
        instance.currentSessionStartedAt.getTime()) /
      1000;

    instance.totalRunningSeconds +=
      sessionSeconds;
  }

  instance.currentSessionStartedAt =
    null;

  instance.status = "stopped";

  instance.stoppedAt = new Date();

  await instance.save();

  return instance
    .populate("owner", "name email")
    .then((result) =>
      result.populate("flavor")
    )
    .then((result) =>
      result.populate("network")
    );
};

// Restart instance
const restartInstance = async (
  instanceId,
  userId
) => {
  const instance = await Instance.findOne({
    _id: instanceId,
    owner: userId,
  });

  if (!instance) {
    const error = new Error(
      "Instance not found"
    );
    error.statusCode = 404;
    throw error;
  }

  if (instance.status !== "running") {
    const error = new Error(
      "Only running instances can be restarted"
    );

    error.statusCode = 400;
    throw error;
  }

  instance.status = "restarting";

  await instance.save();

  // Simulated restart operation
  instance.status = "running";

  await instance.save();

  return instance
    .populate("owner", "name email")
    .then((result) =>
      result.populate("flavor")
    )
    .then((result) =>
      result.populate("network")
    );
};

// Delete / terminate instance
const deleteInstance = async (
  instanceId,
  userId
) => {
  const instance = await Instance.findOne({
    _id: instanceId,
    owner: userId,
  });

  if (!instance) {
    const error = new Error(
      "Instance not found"
    );
    error.statusCode = 404;
    throw error;
  }

  if (instance.status === "running") {
    const error = new Error(
      "Stop the instance before terminating it"
    );

    error.statusCode = 400;
    throw error;
  }

  instance.status = "terminated";
  instance.terminatedAt = new Date();

  await instance.save();

  return {
    message:
      "Instance terminated successfully",
    instance,
  };
};

// Update instance
const updateInstance = async (
  instanceId,
  userId,
  data
) => {
  const instance = await Instance.findOne({
    _id: instanceId,
    owner: userId,
  });

  if (!instance) {
    const error = new Error(
      "Instance not found"
    );
    error.statusCode = 404;
    throw error;
  }

  // Only allow name / SSH key changes
  if (data.name !== undefined) {
    instance.name = data.name;
  }

  if (data.sshKeyName !== undefined) {
    instance.sshKeyName =
      data.sshKeyName;
  }

  await instance.save();

  return instance
    .populate("owner", "name email")
    .then((result) =>
      result.populate("flavor")
    )
    .then((result) =>
      result.populate("network")
    );
};

module.exports = {
  createInstance,
  getUserInstances,
  getInstanceById,
  startInstance,
  stopInstance,
  restartInstance,
  deleteInstance,
  updateInstance,
};