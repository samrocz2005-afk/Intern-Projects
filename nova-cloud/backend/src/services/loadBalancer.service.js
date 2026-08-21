const LoadBalancer = require("../models/LoadBalancer");
const Instance = require("../models/Instance");
const Network = require("../models/Network");

// Create load balancer
const createLoadBalancer = async (
  userId,
  data
) => {
  const {
    name,
    description,
    type,
    protocol,
    listenerPort,
    targetPort,
    algorithm,
    network,
    hourlyPrice,
  } = data;

  const existing = await LoadBalancer.findOne({
    owner: userId,
    name: name.trim(),
  });

  if (existing) {
    const error = new Error(
      "A load balancer with this name already exists"
    );

    error.statusCode = 409;
    throw error;
  }

  // Verify network ownership
  if (network) {
    const networkData = await Network.findOne({
      _id: network,
      owner: userId,
      status: "active",
    });

    if (!networkData) {
      const error = new Error(
        "Network not found or inaccessible"
      );

      error.statusCode = 404;
      throw error;
    }
  }

  const loadBalancer =
    await LoadBalancer.create({
      owner: userId,
      name,
      description,
      type,
      protocol,
      listenerPort,
      targetPort,
      algorithm,
      network: network || null,
      hourlyPrice,
      status: "creating",
    });

  // Simulated provisioning
  loadBalancer.status = "active";

  await loadBalancer.save();

  return loadBalancer;
};

// Get user's load balancers
const getUserLoadBalancers = async (
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

  return LoadBalancer.find(query)
    .populate(
      "network",
      "name cidr gateway status"
    )
    .populate(
      "backendInstances.instance",
      "name status ipAddress"
    )
    .sort({
      createdAt: -1,
    });
};

// Get single load balancer
const getLoadBalancerById = async (
  loadBalancerId,
  userId
) => {
  const loadBalancer =
    await LoadBalancer.findOne({
      _id: loadBalancerId,
      owner: userId,
    })
      .populate(
        "network",
        "name cidr gateway status"
      )
      .populate(
        "backendInstances.instance",
        "name status ipAddress"
      );

  if (!loadBalancer) {
    const error = new Error(
      "Load balancer not found or you do not have access to it"
    );

    error.statusCode = 404;
    throw error;
  }

  return loadBalancer;
};

// Add backend instance
const addBackendInstance = async (
  loadBalancerId,
  userId,
  data
) => {
  const {
    instanceId,
    port,
    weight = 1,
  } = data;

  const loadBalancer =
    await LoadBalancer.findOne({
      _id: loadBalancerId,
      owner: userId,
    });

  if (!loadBalancer) {
    const error = new Error(
      "Load balancer not found"
    );

    error.statusCode = 404;
    throw error;
  }

  if (loadBalancer.status !== "active") {
    const error = new Error(
      "Load balancer is not active"
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
      "Instance not found or inaccessible"
    );

    error.statusCode = 404;
    throw error;
  }

  if (instance.status !== "running") {
    const error = new Error(
      "Only running instances can be added as backends"
    );

    error.statusCode = 400;
    throw error;
  }

  const alreadyExists =
    loadBalancer.backendInstances.some(
      (backend) =>
        backend.instance.toString() ===
        instanceId.toString()
    );

  if (alreadyExists) {
    const error = new Error(
      "Instance is already a backend"
    );

    error.statusCode = 409;
    throw error;
  }

  loadBalancer.backendInstances.push({
    instance: instance._id,
    port,
    weight,
    isActive: true,
    healthStatus: "unknown",
  });

  await loadBalancer.save();

  return getLoadBalancerById(
    loadBalancerId,
    userId
  );
};

// Remove backend instance
const removeBackendInstance = async (
  loadBalancerId,
  backendId,
  userId
) => {
  const loadBalancer =
    await LoadBalancer.findOne({
      _id: loadBalancerId,
      owner: userId,
    });

  if (!loadBalancer) {
    const error = new Error(
      "Load balancer not found"
    );

    error.statusCode = 404;
    throw error;
  }

  const backendExists =
    loadBalancer.backendInstances.some(
      (backend) =>
        backend._id.toString() ===
        backendId.toString()
    );

  if (!backendExists) {
    const error = new Error(
      "Backend instance not found"
    );

    error.statusCode = 404;
    throw error;
  }

  loadBalancer.backendInstances.pull(
    backendId
  );

  await loadBalancer.save();

  return getLoadBalancerById(
    loadBalancerId,
    userId
  );
};

// Update backend health status
const updateBackendHealth = async (
  loadBalancerId,
  backendId,
  healthStatus,
  userId
) => {
  const loadBalancer =
    await LoadBalancer.findOne({
      _id: loadBalancerId,
      owner: userId,
    });

  if (!loadBalancer) {
    const error = new Error(
      "Load balancer not found"
    );

    error.statusCode = 404;
    throw error;
  }

  const backend =
    loadBalancer.backendInstances.id(
      backendId
    );

  if (!backend) {
    const error = new Error(
      "Backend instance not found"
    );

    error.statusCode = 404;
    throw error;
  }

  backend.healthStatus = healthStatus;

  backend.isActive =
    healthStatus === "healthy";

  await loadBalancer.save();

  return getLoadBalancerById(
    loadBalancerId,
    userId
  );
};

// Delete load balancer
const deleteLoadBalancer = async (
  loadBalancerId,
  userId
) => {
  const loadBalancer =
    await LoadBalancer.findOne({
      _id: loadBalancerId,
      owner: userId,
    });

  if (!loadBalancer) {
    const error = new Error(
      "Load balancer not found"
    );

    error.statusCode = 404;
    throw error;
  }

  loadBalancer.status = "deleting";

  await loadBalancer.save();

  await LoadBalancer.findByIdAndDelete(
    loadBalancerId
  );

  return {
    message:
      "Load balancer deleted successfully",
  };
};

module.exports = {
  createLoadBalancer,
  getUserLoadBalancers,
  getLoadBalancerById,
  addBackendInstance,
  removeBackendInstance,
  updateBackendHealth,
  deleteLoadBalancer,
};