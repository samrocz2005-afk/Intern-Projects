const Network = require("../models/Network");
const Instance = require("../models/Instance");
const Router = require("../models/Router");

/*
|--------------------------------------------------------------------------
| Create Network - ADMIN ONLY
|--------------------------------------------------------------------------
*/

const createNetwork = async (adminId, data) => {
  const {
    name,
    description,
    cidr,
    gateway,
    dnsServers,
    type,
    isDefault,
    hourlyPrice,
    monthlyPrice,
  } = data;

  // Prevent duplicate network names globally
  const existingNetwork = await Network.findOne({
    name: name.trim(),
  });

  if (existingNetwork) {
    const error = new Error(
      "A network with this name already exists"
    );

    error.statusCode = 409;
    throw error;
  }

  // Only one default network
  if (isDefault) {
    await Network.updateMany(
      {
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );
  }

  const network = await Network.create({
    owner: adminId,

    name: name.trim(),

    description,

    cidr: cidr.trim(),

    gateway: gateway || null,

    dnsServers: dnsServers || [],

    type: type || "private",

    isDefault: isDefault || false,

    hourlyPrice: Number(hourlyPrice) || 0,

    monthlyPrice:
      monthlyPrice !== undefined &&
      monthlyPrice !== null
        ? Number(monthlyPrice)
        : null,

    status: "active",
  });

  return network;
};

/*
|--------------------------------------------------------------------------
| Get Networks - ADMIN + USER
|--------------------------------------------------------------------------
|
| Networks are global resources created by ADMIN.
|
| USER:
|   Can only VIEW active networks.
|
| ADMIN:
|   Can view all networks.
|
|--------------------------------------------------------------------------
*/

const getUserNetworks = async (userId, filters = {}) => {
  const query = {};

  /*
  |--------------------------------------------------------------------------
  | USER VIEW
  |--------------------------------------------------------------------------
  */

  if (filters.status) {
    query.status = filters.status;
  } else {
    // Normal user view should only show active networks
    query.status = "active";
  }

  if (filters.type) {
    query.type = filters.type;
  }

  return Network.find(query)
    .sort({
      createdAt: -1,
    })
    .lean();
};

/*
|--------------------------------------------------------------------------
| Get Single Network
|--------------------------------------------------------------------------
|
| ADMIN + USER
|
| User can view any active network.
|
|--------------------------------------------------------------------------
*/

const getNetworkById = async (
  networkId,
  userId,
  isAdmin = false
) => {
  const query = {
    _id: networkId,
  };

  // Normal user can only see active networks
  if (!isAdmin) {
    query.status = "active";
  }

  const network = await Network.findOne(query);

  if (!network) {
    const error = new Error(
      "Network not found or you do not have access to it"
    );

    error.statusCode = 404;

    throw error;
  }

  return network;
};

/*
|--------------------------------------------------------------------------
| Update Network - ADMIN ONLY
|--------------------------------------------------------------------------
*/

const updateNetwork = async (
  networkId,
  adminId,
  data
) => {
  const network = await Network.findById(
    networkId
  );

  if (!network) {
    const error = new Error(
      "Network not found"
    );

    error.statusCode = 404;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent CIDR changes when network is being used
  |--------------------------------------------------------------------------
  */

  if (
    data.cidr &&
    data.cidr !== network.cidr
  ) {
    const instanceCount =
      await Instance.countDocuments({
        network: networkId,
        status: {
          $ne: "terminated",
        },
      });

    if (instanceCount > 0) {
      const error = new Error(
        "Cannot change CIDR while the network has active instances"
      );

      error.statusCode = 400;

      throw error;
    }

    network.cidr = data.cidr.trim();
  }

  /*
  |--------------------------------------------------------------------------
  | Basic fields
  |--------------------------------------------------------------------------
  */

  if (data.name !== undefined) {
    const duplicate = await Network.findOne({
      name: data.name.trim(),
      _id: {
        $ne: networkId,
      },
    });

    if (duplicate) {
      const error = new Error(
        "A network with this name already exists"
      );

      error.statusCode = 409;

      throw error;
    }

    network.name = data.name.trim();
  }

  if (data.description !== undefined) {
    network.description =
      data.description;
  }

  if (data.gateway !== undefined) {
    network.gateway =
      data.gateway || null;
  }

  if (data.dnsServers !== undefined) {
    network.dnsServers =
      data.dnsServers;
  }

  if (data.type !== undefined) {
    network.type = data.type;
  }

  /*
  |--------------------------------------------------------------------------
  | Pricing
  |--------------------------------------------------------------------------
  */

  if (data.hourlyPrice !== undefined) {
    network.hourlyPrice =
      Number(data.hourlyPrice);
  }

  if (data.monthlyPrice !== undefined) {
    network.monthlyPrice =
      data.monthlyPrice === null
        ? null
        : Number(data.monthlyPrice);
  }

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  if (data.status !== undefined) {
    network.status = data.status;
  }

  /*
  |--------------------------------------------------------------------------
  | Default network
  |--------------------------------------------------------------------------
  */

  if (data.isDefault === true) {
    await Network.updateMany(
      {
        _id: {
          $ne: networkId,
        },

        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    network.isDefault = true;
  }

  if (data.isDefault === false) {
    network.isDefault = false;
  }

  await network.save();

  return network;
};

/*
|--------------------------------------------------------------------------
| Delete Network - ADMIN ONLY
|--------------------------------------------------------------------------
*/

const deleteNetwork = async (
  networkId,
  adminId
) => {
  const network =
    await Network.findById(networkId);

  if (!network) {
    const error = new Error(
      "Network not found"
    );

    error.statusCode = 404;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Check instances
  |--------------------------------------------------------------------------
  */

  const instanceCount =
    await Instance.countDocuments({
      network: networkId,

      status: {
        $ne: "terminated",
      },
    });

  if (instanceCount > 0) {
    const error = new Error(
      "Cannot delete a network that has active instances"
    );

    error.statusCode = 400;

    throw error;
  }

  /*
  |--------------------------------------------------------------------------
  | Check routers
  |--------------------------------------------------------------------------
  */

  const routerCount =
    await Router.countDocuments({
      networks: networkId,
    });

  if (routerCount > 0) {
    const error = new Error(
      "Cannot delete a network connected to a router"
    );

    error.statusCode = 400;

    throw error;
  }

  await Network.findByIdAndDelete(
    networkId
  );

  return {
    message:
      "Network deleted successfully",
  };
};

/*
|--------------------------------------------------------------------------
| Get Network Instances
|--------------------------------------------------------------------------
|
| ADMIN ONLY
|
|--------------------------------------------------------------------------
*/

const getNetworkInstances = async (
  networkId,
  userId
) => {
  const network =
    await Network.findById(networkId);

  if (!network) {
    const error = new Error(
      "Network not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return Instance.find({
    network: networkId,

    status: {
      $ne: "terminated",
    },
  })
    .populate("flavor")
    .sort({
      createdAt: -1,
    });
};

module.exports = {
  createNetwork,
  getUserNetworks,
  getNetworkById,
  updateNetwork,
  deleteNetwork,
  getNetworkInstances,
};