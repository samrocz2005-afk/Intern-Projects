const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| MongoDB ObjectId
|--------------------------------------------------------------------------
*/

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Invalid MongoDB ID",
  });

/*
|--------------------------------------------------------------------------
| Network Patterns
|--------------------------------------------------------------------------
*/

const cidrPattern =
  /^(?:\d{1,3}\.){3}\d{1,3}\/(?:[0-9]|[12]\d|3[0-2])$/;

const ipv4Pattern =
  /^(?:\d{1,3}\.){3}\d{1,3}$/;

/*
|--------------------------------------------------------------------------
| Create Network
|--------------------------------------------------------------------------
| POST /api/networks
|--------------------------------------------------------------------------
*/

const createNetworkSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required(),

    description: Joi.string()
      .trim()
      .max(300)
      .allow("", null)
      .default(null),

    cidr: Joi.string()
      .trim()
      .pattern(cidrPattern)
      .required()
      .messages({
        "string.pattern.base":
          "CIDR must be in a valid format such as 192.168.1.0/24",
      }),

    /*
    |--------------------------------------------------------------------------
    | Gateway is OPTIONAL
    |--------------------------------------------------------------------------
    |
    | Your MongoDB model already allows null.
    |
    */

    gateway: Joi.string()
      .trim()
      .pattern(ipv4Pattern)
      .allow("", null)
      .default(null)
      .messages({
        "string.pattern.base":
          "Gateway must be a valid IPv4 address",
      }),

    dnsServers: Joi.array()
      .items(
        Joi.string()
          .trim()
          .pattern(ipv4Pattern)
          .messages({
            "string.pattern.base":
              "DNS server must be a valid IPv4 address",
          })
      )
      .max(5)
      .default([]),

    type: Joi.string()
      .valid("public", "private")
      .default("private"),

    isDefault: Joi.boolean()
      .default(false),

    /*
    |--------------------------------------------------------------------------
    | Hourly / Monthly pricing
    |--------------------------------------------------------------------------
    |
    | Include these only if admin creates pricing.
    |
    */

    hourlyPrice: Joi.number()
      .min(0)
      .default(0),

    monthlyPrice: Joi.number()
      .min(0)
      .allow(null)
      .default(null),
  }).required(),

  params: Joi.object().required(),

  query: Joi.object().required(),
});

/*
|--------------------------------------------------------------------------
| Update Network
|--------------------------------------------------------------------------
| PUT /api/networks/:id
|--------------------------------------------------------------------------
*/

const updateNetworkSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50),

    description: Joi.string()
      .trim()
      .max(300)
      .allow("", null),

    cidr: Joi.string()
      .trim()
      .pattern(cidrPattern)
      .messages({
        "string.pattern.base":
          "CIDR must be in a valid format such as 192.168.1.0/24",
      }),

    gateway: Joi.string()
      .trim()
      .pattern(ipv4Pattern)
      .allow("", null)
      .messages({
        "string.pattern.base":
          "Gateway must be a valid IPv4 address",
      }),

    dnsServers: Joi.array()
      .items(
        Joi.string()
          .trim()
          .pattern(ipv4Pattern)
          .messages({
            "string.pattern.base":
              "DNS server must be a valid IPv4 address",
          })
      )
      .max(5),

    type: Joi.string().valid(
      "public",
      "private"
    ),

    isDefault: Joi.boolean(),

    hourlyPrice: Joi.number()
      .min(0),

    monthlyPrice: Joi.number()
      .min(0)
      .allow(null),
  })
    .min(1)
    .required(),

  params: Joi.object({
    id: objectId.required(),
  }).required(),

  query: Joi.object().required(),
});

/*
|--------------------------------------------------------------------------
| Network ID
|--------------------------------------------------------------------------
| GET /api/networks/:id
| DELETE /api/networks/:id
|--------------------------------------------------------------------------
*/

const networkIdSchema = Joi.object({
  params: Joi.object({
    id: objectId.required(),
  }).required(),

  query: Joi.object().required(),
});

/*
|--------------------------------------------------------------------------
| List Networks
|--------------------------------------------------------------------------
| GET /api/networks
|--------------------------------------------------------------------------
*/

const listNetworksSchema = Joi.object({
  params: Joi.object().required(),

  query: Joi.object({
    status: Joi.string().valid(
      "creating",
      "active",
      "inactive",
      "error",
      "deleting"
    ),

    type: Joi.string().valid(
      "public",
      "private"
    ),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  createNetworkSchema,
  updateNetworkSchema,
  networkIdSchema,
  listNetworksSchema,
};