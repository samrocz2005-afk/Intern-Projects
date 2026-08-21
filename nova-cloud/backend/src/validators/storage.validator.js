const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Invalid MongoDB ID",
  });

const createStorageSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required(),

    size: Joi.number()
      .integer()
      .min(1)
      .max(65536)
      .required()
      .messages({
        "number.min":
          "Storage size must be at least 1 GB",
        "number.max":
          "Storage size cannot exceed 65536 GB",
      }),

    type: Joi.string()
      .valid("ssd", "hdd", "nvme")
      .default("ssd"),

    encrypted: Joi.boolean()
      .default(true),

    hourlyPrice: Joi.number()
      .min(0)
      .optional(),
  }).required(),

  params: Joi.object().required(),

  query: Joi.object().required(),
});

const updateStorageSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50),

    size: Joi.number()
      .integer()
      .min(1)
      .max(65536),

    type: Joi.string().valid(
      "ssd",
      "hdd",
      "nvme"
    ),
  })
    .min(1)
    .required(),

  params: Joi.object({
    id: objectId.required(),
  }).required(),

  query: Joi.object().required(),
});

const storageIdSchema = Joi.object({
  body: Joi.object().required(),

  params: Joi.object({
    id: objectId.required(),
  }).required(),

  query: Joi.object().required(),
});

const attachStorageSchema = Joi.object({
  body: Joi.object({
    instanceId: objectId.required(),
  }).required(),

  params: Joi.object({
    id: objectId.required(),
  }).required(),

  query: Joi.object().required(),
});

const listStorageSchema = Joi.object({
  body: Joi.object().required(),

  params: Joi.object().required(),

  query: Joi.object({
    status: Joi.string().valid(
      "available",
      "attaching",
      "attached",
      "detaching",
      "error"
    ),

    type: Joi.string().valid(
      "ssd",
      "hdd",
      "nvme"
    ),
  }).required(),
});

module.exports = {
  createStorageSchema,
  updateStorageSchema,
  storageIdSchema,
  attachStorageSchema,
  listStorageSchema,
};