const Router = require("../models/Router");
const Network = require("../models/Network");

// Create router
const createRouter = async (userId, data) => {
  const {
    name,
    description,
    networks = [],
    externalNetwork,
    gatewayIp,
    enableNat,
    hourlyPrice,
  } = data;

  const existingRouter = await Router.findOne({
    owner: userId,
    name: name.trim(),
  });

  if (existingRouter) {
    const error = new Error(
      "A router with this name already exists"
    );

    error.statusCode = 409;
    throw error;
  }

  // Verify that all networks belong to the user
  if (networks.length > 0) {
    const validNetworks = await Network.countDocuments({
      _id: { $in: networks },
      owner: userId,
      status: "active",
    });

    if (validNetworks !== networks.length) {
      const error = new Error(
        "One or more networks are invalid or inaccessible"
      );

      error.statusCode = 400;
      throw error;
    }
  }

  const router = await Router.create({
    owner: userId,
    name,
    description,
    networks,
    externalNetwork,
    gatewayIp,
    enableNat,
    hourlyPrice,
    status: "active",
  });

  return Router.findById(router._id).populate(
    "networks",
    "name cidr gateway status"
  );
};

// Get user's routers
const getUserRouters = async (userId, filters = {}) => {
  const query = {
    owner: userId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  return Router.find(query)
    .populate(
      "networks",
      "name cidr gateway status"
    )
    .sort({
      createdAt: -1,
    });
};

// Get router by ID
const getRouterById = async (
  routerId,
  userId
) => {
  const router = await Router.findOne({
    _id: routerId,
    owner: userId,
  }).populate(
    "networks",
    "name cidr gateway status"
  );

  if (!router) {
    const error = new Error(
      "Router not found or you do not have access to it"
    );

    error.statusCode = 404;
    throw error;
  }

  return router;
};

// Connect network to router
const connectNetwork = async (
  routerId,
  networkId,
  userId
) => {
  const router = await Router.findOne({
    _id: routerId,
    owner: userId,
  });

  if (!router) {
    const error = new Error("Router not found");
    error.statusCode = 404;
    throw error;
  }

  const network = await Network.findOne({
    _id: networkId,
    owner: userId,
    status: "active",
  });

  if (!network) {
    const error = new Error(
      "Network not found or inaccessible"
    );

    error.statusCode = 404;
    throw error;
  }

  const alreadyConnected = router.networks.some(
    (id) => id.toString() === networkId.toString()
  );

  if (alreadyConnected) {
    const error = new Error(
      "Network is already connected to this router"
    );

    error.statusCode = 409;
    throw error;
  }

  router.networks.push(network._id);

  await router.save();

  return Router.findById(router._id).populate(
    "networks",
    "name cidr gateway status"
  );
};

// Disconnect network
const disconnectNetwork = async (
  routerId,
  networkId,
  userId
) => {
  const router = await Router.findOne({
    _id: routerId,
    owner: userId,
  });

  if (!router) {
    const error = new Error("Router not found");
    error.statusCode = 404;
    throw error;
  }

  router.networks = router.networks.filter(
    (id) => id.toString() !== networkId.toString()
  );

  await router.save();

  return router.populate(
    "networks",
    "name cidr gateway status"
  );
};

// Update router
const updateRouter = async (
  routerId,
  userId,
  data
) => {
  const router = await Router.findOne({
    _id: routerId,
    owner: userId,
  });

  if (!router) {
    const error = new Error("Router not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.name !== undefined) {
    router.name = data.name;
  }

  if (data.description !== undefined) {
    router.description = data.description;
  }

  if (data.externalNetwork !== undefined) {
    router.externalNetwork = data.externalNetwork;
  }

  if (data.gatewayIp !== undefined) {
    router.gatewayIp = data.gatewayIp;
  }

  if (data.enableNat !== undefined) {
    router.enableNat = data.enableNat;
  }

  await router.save();

  return router.populate(
    "networks",
    "name cidr gateway status"
  );
};

// Delete router
const deleteRouter = async (
  routerId,
  userId
) => {
  const router = await Router.findOne({
    _id: routerId,
    owner: userId,
  });

  if (!router) {
    const error = new Error("Router not found");
    error.statusCode = 404;
    throw error;
  }

  if (router.networks.length > 0) {
    const error = new Error(
      "Disconnect all networks before deleting the router"
    );

    error.statusCode = 400;
    throw error;
  }

  await Router.findByIdAndDelete(routerId);

  return {
    message: "Router deleted successfully",
  };
};

module.exports = {
  createRouter,
  getUserRouters,
  getRouterById,
  connectNetwork,
  disconnectNetwork,
  updateRouter,
  deleteRouter,
};