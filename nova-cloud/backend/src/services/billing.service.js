const Billing = require("../models/Billing");
const UsageRecord = require("../models/UsageRecord");
const Instance = require("../models/Instance");
const Storage = require("../models/Storage");
const Router = require("../models/Router");
const LoadBalancer = require("../models/LoadBalancer");
const Flavor = require("../models/Flavor");

/*
|--------------------------------------------------------------------------
| Generate Invoice Number
|--------------------------------------------------------------------------
*/

const generateInvoiceNumber = () => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const random = Math.floor(100000 + Math.random() * 900000);

  return `INV-${year}${month}-${random}`;
};

/*
|--------------------------------------------------------------------------
| Calculate Amount
|--------------------------------------------------------------------------
*/

const calculateAmount = (durationHours, hourlyPrice) => {
  const hours = Number(durationHours) || 0;
  const price = Number(hourlyPrice) || 0;

  return Number((hours * price).toFixed(4));
};

/*
|--------------------------------------------------------------------------
| Normalize Resource ID
|--------------------------------------------------------------------------
|
| ALWAYS return only the MongoDB ObjectId.
|
| Supports:
|
| ObjectId
| MongoDB document
| string ObjectId
|
|--------------------------------------------------------------------------
*/

const getResourceId = (resource) => {
  if (!resource) {
    return null;
  }

  if (typeof resource === "object" && resource._id) {
    return resource._id;
  }

  return resource;
};

/*
|--------------------------------------------------------------------------
| Get User Billing
|--------------------------------------------------------------------------
*/

const getUserBilling = async (userId, filters = {}) => {
  if (!userId) {
    const error = new Error("User ID is required");

    error.statusCode = 400;

    throw error;
  }

  const query = {
    user: userId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  return Billing.find(query).populate("user", "name email role balance").sort({
    billingPeriodStart: -1,
    createdAt: -1,
  });
};

/*
|--------------------------------------------------------------------------
| Get All Billing
|--------------------------------------------------------------------------
*/

const getAllBilling = async (filters = {}) => {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.user) {
    query.user = filters.user;
  }

  return Billing.find(query).populate("user", "name email role").sort({
    billingPeriodStart: -1,
    createdAt: -1,
  });
};

/*
|--------------------------------------------------------------------------
| Get Billing By ID
|--------------------------------------------------------------------------
*/

const getBillingById = async (billingId, userId) => {
  if (!billingId || !userId) {
    const error = new Error("Billing ID and user ID are required");

    error.statusCode = 400;

    throw error;
  }

  const billing = await Billing.findOne({
    _id: billingId,
    user: userId,
  }).populate("user", "name email role");

  if (!billing) {
    const error = new Error("Billing record not found");

    error.statusCode = 404;

    throw error;
  }

  return billing;
};

/*
|--------------------------------------------------------------------------
| Find Existing Pending Usage
|--------------------------------------------------------------------------
|
| ONE pending usage record per:
|
| owner + resourceType + resource
|
|--------------------------------------------------------------------------
*/

const findActiveUsageRecord = async ({ owner, resourceType, resource }) => {
  const resourceId = getResourceId(resource);

  if (!resourceId) {
    return null;
  }

  return UsageRecord.findOne({
    owner,
    resourceType,
    resource: resourceId,
    status: "pending",
  }).sort({
    usageStart: 1,
  });
};

/*
|--------------------------------------------------------------------------
| Create / Update Usage Record
|--------------------------------------------------------------------------
*/

const createOrUpdateUsageRecord = async ({
  owner,
  resourceType,
  resource,
  resourceTypeModel,
  usageStart,
  usageEnd,
  unitPrice,
}) => {
  if (!owner || !resource || !usageStart || !usageEnd) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT
  |--------------------------------------------------------------------------
  | Convert full resource object into ObjectId.
  |--------------------------------------------------------------------------
  */

  const resourceId = getResourceId(resource);

  if (!resourceId) {
    return null;
  }

  const requestedStart = new Date(usageStart);

  const end = new Date(usageEnd);

  if (Number.isNaN(requestedStart.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Find Existing Usage
  |--------------------------------------------------------------------------
  */

  let usage = await findActiveUsageRecord({
    owner,
    resourceType,
    resource: resourceId,
  });

  /*
  |--------------------------------------------------------------------------
  | UPDATE EXISTING
  |--------------------------------------------------------------------------
  |
  | NEVER reset usageStart.
  |--------------------------------------------------------------------------
  */

  if (usage) {
    const start = new Date(usage.usageStart);

    if (Number.isNaN(start.getTime()) || end <= start) {
      return null;
    }

    const durationSeconds = (end.getTime() - start.getTime()) / 1000;

    const durationHours = durationSeconds / 3600;

    const normalizedPrice = Number(unitPrice) || 0;

    const amount = calculateAmount(durationHours, normalizedPrice);

    usage.usageEnd = end;

    usage.durationSeconds = durationSeconds;

    usage.durationHours = durationHours;

    usage.unitPrice = normalizedPrice;

    usage.amount = amount;

    usage.billingPeriodEnd = end;

    /*
    |--------------------------------------------------------------------------
    | Make absolutely sure resource remains ObjectId.
    |--------------------------------------------------------------------------
    */

    usage.resource = resourceId;

    await usage.save();

    return usage;
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE FIRST USAGE RECORD
  |--------------------------------------------------------------------------
  */

  if (end <= requestedStart) {
    return null;
  }

  const durationSeconds = (end.getTime() - requestedStart.getTime()) / 1000;

  const durationHours = durationSeconds / 3600;

  const normalizedPrice = Number(unitPrice) || 0;

  const amount = calculateAmount(durationHours, normalizedPrice);

  if (durationSeconds < 1) {
    return null;
  }

  usage = await UsageRecord.create({
    owner,

    resourceType,

    /*
      | IMPORTANT:
      | Only ObjectId
      */
    resource: resourceId,

    resourceTypeModel,

    usageStart: requestedStart,

    usageEnd: end,

    durationSeconds,

    durationHours,

    unitPrice: normalizedPrice,

    amount,

    currency: "INR",

    billingType: "hourly",

    status: "pending",

    billingPeriodStart: requestedStart,

    billingPeriodEnd: end,
  });

  return usage;
};

/*
|--------------------------------------------------------------------------
| Bill Running Instance
|--------------------------------------------------------------------------
*/

const billInstance = async (instance, periodStart, periodEnd = new Date()) => {
  if (
    !instance ||
    instance.status !== "running" ||
    !instance.currentSessionStartedAt
  ) {
    return null;
  }

  const flavor = await Flavor.findById(getResourceId(instance.flavor));

  if (!flavor) {
    const error = new Error(`Flavor not found for instance ${instance._id}`);

    error.statusCode = 404;

    throw error;
  }

  const sessionStart = new Date(instance.currentSessionStartedAt);

  const billingStart = new Date(periodStart);

  const billingEnd = new Date(periodEnd);

  if (
    Number.isNaN(sessionStart.getTime()) ||
    Number.isNaN(billingStart.getTime()) ||
    Number.isNaN(billingEnd.getTime())
  ) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Existing Usage
  |--------------------------------------------------------------------------
  */

  const existingUsage = await findActiveUsageRecord({
    owner: instance.owner,

    resourceType: "instance",

    resource: instance._id,
  });

  /*
  |--------------------------------------------------------------------------
  | Keep Original Start
  |--------------------------------------------------------------------------
  */

  const usageStart = existingUsage?.usageStart
    ? new Date(existingUsage.usageStart)
    : sessionStart > billingStart
      ? sessionStart
      : billingStart;

  const usageEnd = billingEnd;

  if (usageEnd <= usageStart) {
    return null;
  }

  const durationSeconds = (usageEnd.getTime() - usageStart.getTime()) / 1000;

  if (durationSeconds < 1) {
    return null;
  }

  const usage = await createOrUpdateUsageRecord({
    owner: instance.owner,

    resourceType: "instance",

    resource: instance._id,

    resourceTypeModel: "Instance",

    usageStart,

    usageEnd,

    unitPrice: flavor.hourlyPrice,
  });

  if (!usage) {
    return null;
  }

  instance.totalRunningSeconds = usage.durationSeconds;

  instance.totalCost = usage.amount;

  await instance.save();

  return usage;
};

/*
|--------------------------------------------------------------------------
| Bill Storage / Router / Load Balancer
|--------------------------------------------------------------------------
*/

const billResource = async ({
  resource,
  resourceType,
  resourceTypeModel,
  hourlyPrice,
  startTime,
  endTime,
}) => {
  if (!resource || !startTime || !endTime) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | ALWAYS use ObjectId
  |--------------------------------------------------------------------------
  */

  const resourceId = getResourceId(resource);

  if (!resourceId) {
    return null;
  }

  /*
  |--------------------------------------------------------------------------
  | Find Existing Usage
  |--------------------------------------------------------------------------
  */

  const existingUsage = await findActiveUsageRecord({
    owner: resource.owner,

    resourceType,

    resource: resourceId,
  });

  /*
  |--------------------------------------------------------------------------
  | Keep Original Start
  |--------------------------------------------------------------------------
  */

  let actualStart;

  if (existingUsage && existingUsage.usageStart) {
    actualStart = new Date(existingUsage.usageStart);
  } else {
    actualStart = new Date(startTime);
  }

  const actualEnd = new Date(endTime);

  if (
    Number.isNaN(actualStart.getTime()) ||
    Number.isNaN(actualEnd.getTime())
  ) {
    return null;
  }

  if (actualEnd <= actualStart) {
    return null;
  }

  return createOrUpdateUsageRecord({
    owner: resource.owner,

    resourceType,

    /*
    | IMPORTANT:
    | ObjectId only
    */
    resource: resourceId,

    resourceTypeModel,

    usageStart: actualStart,

    usageEnd: actualEnd,

    unitPrice: hourlyPrice,
  });
};

/*
|--------------------------------------------------------------------------
| Get Resource Details For Billing
|--------------------------------------------------------------------------
|
| Used ONLY for display names.
|
|--------------------------------------------------------------------------
*/

const getResourceDetails = async (usage) => {
  const resourceId = getResourceId(usage.resource);

  if (!resourceId) {
    return null;
  }

  switch (usage.resourceType) {
    case "load_balancer":
      return LoadBalancer.findById(resourceId).select("_id name hourlyPrice");

    case "instance":
      return Instance.findById(resourceId).select("_id name");

    case "storage":
      return Storage.findById(resourceId).select("_id name");

    case "router":
      return Router.findById(resourceId).select("_id name");

    default:
      return null;
  }
};

/*
|--------------------------------------------------------------------------
| Build Billing Items
|--------------------------------------------------------------------------
|
| ONE item per:
|
| resourceType + resource
|
| resource = ObjectId
|
| resourceName = actual resource name
|
|--------------------------------------------------------------------------
*/

const buildBillingItems = async (usageRecords) => {
  const itemMap = new Map();

  for (const usage of usageRecords) {
    if (!usage || !usage.resource) {
      continue;
    }

    const resourceId = getResourceId(usage.resource);

    if (!resourceId) {
      continue;
    }

    const resourceIdString = String(resourceId);

    const key = `${usage.resourceType}:${resourceIdString}`;

    /*
    |--------------------------------------------------------------------------
    | Get actual resource
    |--------------------------------------------------------------------------
    */

    const resourceDetails = await getResourceDetails(usage);

    /*
    |--------------------------------------------------------------------------
    | Display name
    |--------------------------------------------------------------------------
    */

    let resourceName = `${usage.resourceType} ${resourceIdString}`;

    if (resourceDetails?.name) {
      resourceName = resourceDetails.name;
    }

    /*
    |--------------------------------------------------------------------------
    | Store item
    |--------------------------------------------------------------------------
    */

    itemMap.set(key, {
      resourceType: usage.resourceType,

      /*
      | IMPORTANT:
      | Billing schema receives ObjectId
      */
      resource: resourceId,

      /*
      | Human readable name
      */
      resourceName,

      description: `${Number(usage.durationHours || 0).toFixed(
        2,
      )} hours of usage`,

      quantity: Number(Number(usage.durationHours || 0).toFixed(4)),

      unit: "hour",

      unitPrice: Number(usage.unitPrice || 0),

      amount: Number(usage.amount || 0),
    });
  }

  return Array.from(itemMap.values());
};

/*
|--------------------------------------------------------------------------
| Generate / Update Billing
|--------------------------------------------------------------------------
|
| ONE pending invoice per user.
|
|--------------------------------------------------------------------------
*/

const generateBillingFromUsage = async (
  userId,
  usageRecords,
  periodStart,
  periodEnd,
) => {
  if (!userId || !Array.isArray(usageRecords) || !usageRecords.length) {
    return null;
  }

  /*
    |--------------------------------------------------------------------------
    | Deduplicate resources
    |--------------------------------------------------------------------------
    */

  const usageMap = new Map();

  for (const usage of usageRecords) {
    if (!usage || !usage.resource) {
      continue;
    }

    const resourceId = getResourceId(usage.resource);

    if (!resourceId) {
      continue;
    }

    const key = `${usage.resourceType}:${String(resourceId)}`;

    /*
      | Latest usage wins
      */
    usageMap.set(key, usage);
  }

  const uniqueUsageRecords = Array.from(usageMap.values());

  if (!uniqueUsageRecords.length) {
    return null;
  }

  /*
    |--------------------------------------------------------------------------
    | Build Billing Items
    |--------------------------------------------------------------------------
    */

  const items = await buildBillingItems(uniqueUsageRecords);

  if (!items.length) {
    return null;
  }

  /*
    |--------------------------------------------------------------------------
    | Calculate Subtotal
    |--------------------------------------------------------------------------
    */

  const subtotal = Number(
    items.reduce((sum, item) => sum + Number(item.amount || 0), 0).toFixed(4),
  );

  /*
    |--------------------------------------------------------------------------
    | GST 18%
    |--------------------------------------------------------------------------
    */

  const tax = Number((subtotal * 0.18).toFixed(4));

  const discount = 0;

  const total = Number((subtotal + tax - discount).toFixed(4));

  /*
    |--------------------------------------------------------------------------
    | Find ONE Pending Invoice
    |--------------------------------------------------------------------------
    */

  let billing = await Billing.findOne({
    user: userId,

    status: "pending",
  }).sort({
    createdAt: -1,
  });

  /*
    |--------------------------------------------------------------------------
    | UPDATE EXISTING INVOICE
    |--------------------------------------------------------------------------
    */

  if (billing) {
    billing.billingPeriodStart = billing.billingPeriodStart || periodStart;

    billing.billingPeriodEnd = periodEnd;

    billing.items = items;

    billing.subtotal = subtotal;

    billing.tax = tax;

    billing.discount = discount;

    billing.total = total;

    billing.currency = "INR";

    await billing.save();

    return billing;
  }

  /*
    |--------------------------------------------------------------------------
    | CREATE FIRST INVOICE
    |--------------------------------------------------------------------------
    */

  billing = await Billing.create({
    user: userId,

    invoiceNumber: generateInvoiceNumber(),

    billingPeriodStart: periodStart,

    billingPeriodEnd: periodEnd,

    items,

    subtotal,

    tax,

    discount,

    total,

    currency: "INR",

    status: "pending",

    paymentMethod: "none",

    paidAt: null,
  });

  return billing;
};

/*
|--------------------------------------------------------------------------
| Process Billing For ONE User
|--------------------------------------------------------------------------
*/

const processUserBilling = async (userId, periodStart, periodEnd) => {
  if (!userId) {
    const error = new Error("User ID is required");

    error.statusCode = 400;

    throw error;
  }

  const start = new Date(periodStart);

  const end = new Date(periodEnd);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    const error = new Error("Invalid billing period");

    error.statusCode = 400;

    throw error;
  }

  const usageRecords = [];

  /*
    |--------------------------------------------------------------------------
    | INSTANCES
    |--------------------------------------------------------------------------
    */

  const instances = await Instance.find({
    owner: userId,

    status: "running",

    currentSessionStartedAt: {
      $ne: null,
    },
  }).populate("flavor");

  for (const instance of instances) {
    const usage = await billInstance(instance, start, end);

    if (usage) {
      usageRecords.push(usage);
    }
  }

  /*
    |--------------------------------------------------------------------------
    | STORAGE
    |--------------------------------------------------------------------------
    */

  const storages = await Storage.find({
    owner: userId,

    status: {
      $in: ["available", "attached"],
    },
  });

  for (const storage of storages) {
    const usage = await billResource({
      resource: storage,

      resourceType: "storage",

      resourceTypeModel: "Storage",

      hourlyPrice: storage.hourlyPrice,

      startTime: start,

      endTime: end,
    });

    if (usage) {
      usageRecords.push(usage);
    }
  }

  /*
    |--------------------------------------------------------------------------
    | ROUTERS
    |--------------------------------------------------------------------------
    */

  const routers = await Router.find({
    owner: userId,

    status: "active",
  });

  for (const router of routers) {
    const usage = await billResource({
      resource: router,

      resourceType: "router",

      resourceTypeModel: "Router",

      hourlyPrice: router.hourlyPrice,

      startTime: start,

      endTime: end,
    });

    if (usage) {
      usageRecords.push(usage);
    }
  }

  /*
    |--------------------------------------------------------------------------
    | LOAD BALANCERS
    |--------------------------------------------------------------------------
    */

  const loadBalancers = await LoadBalancer.find({
    owner: userId,

    status: "active",
  });

  for (const loadBalancer of loadBalancers) {
    const usage = await billResource({
      resource: loadBalancer,

      resourceType: "load_balancer",

      resourceTypeModel: "LoadBalancer",

      hourlyPrice: loadBalancer.hourlyPrice,

      startTime: start,

      endTime: end,
    });

    if (usage) {
      usageRecords.push(usage);
    }
  }

  /*
    |--------------------------------------------------------------------------
    | NO USAGE
    |--------------------------------------------------------------------------
    */

  if (!usageRecords.length) {
    return null;
  }

  /*
    |--------------------------------------------------------------------------
    | CREATE / UPDATE BILLING
    |--------------------------------------------------------------------------
    */

  return generateBillingFromUsage(userId, usageRecords, start, end);
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  getUserBilling,

  getAllBilling,

  getBillingById,

  createUsageRecord: createOrUpdateUsageRecord,

  billInstance,

  billResource,

  generateBillingFromUsage,

  processUserBilling,

  calculateAmount,

  generateInvoiceNumber,
};
