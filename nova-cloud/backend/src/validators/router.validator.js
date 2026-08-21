const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| Router ID Validation
|--------------------------------------------------------------------------
*/

const routerIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .trim()
      .required(),
  }).required(),

  query: Joi.object().required(),
});

/*
|--------------------------------------------------------------------------
| Create Router Validation
|--------------------------------------------------------------------------
| POST /api/routers
|--------------------------------------------------------------------------
*/

const createRouterSchema = Joi.object({
  body: Joi.object({
    /*
    |--------------------------------------------------------------------------
    | Router Name
    |--------------------------------------------------------------------------
    */

    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        "any.required":
          "Router name is required",

        "string.empty":
          "Router name is required",

        "string.min":
          "Router name must be at least 2 characters",

        "string.max":
          "Router name cannot exceed 100 characters",
      }),

    /*
    |--------------------------------------------------------------------------
    | Network
    |--------------------------------------------------------------------------
    */

    networkId: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required":
          "Network is required",

        "string.empty":
          "Network is required",
      }),

    /*
    |--------------------------------------------------------------------------
    | Gateway
    |--------------------------------------------------------------------------
    */

    gateway: Joi.string()
      .trim()
      .ip({
        version: ["ipv4"],
        cidr: "forbidden",
      })
      .allow("", null)
      .default(null)
      .messages({
        "string.ip":
          "Gateway must be a valid IPv4 address",
      }),

    /*
    |--------------------------------------------------------------------------
    | Description
    |--------------------------------------------------------------------------
    */

    description: Joi.string()
      .trim()
      .max(500)
      .allow("", null)
      .default(null)
      .messages({
        "string.max":
          "Description cannot exceed 500 characters",
      }),

    /*
    |--------------------------------------------------------------------------
    | Hourly Price
    |--------------------------------------------------------------------------
    */

    hourlyPrice: Joi.number()
      .min(0)
      .required()
      .messages({
        "any.required":
          "Router hourly price is required",

        "number.base":
          "Router hourly price must be a number",

        "number.min":
          "Router hourly price cannot be negative",
      }),

    /*
    |--------------------------------------------------------------------------
    | Optional IP Address
    |--------------------------------------------------------------------------
    */

    ipAddress: Joi.string()
      .ip({
        version: ["ipv4", "ipv6"],
        cidr: "forbidden",
      })
      .allow(null, ""),

    /*
    |--------------------------------------------------------------------------
    | Optional MAC Address
    |--------------------------------------------------------------------------
    */

    macAddress: Joi.string()
      .trim()
      .allow(null, ""),

    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    status: Joi.string()
      .valid(
        "active",
        "inactive",
        "online",
        "offline"
      )
      .default("inactive"),
  }).required(),

  params: Joi.object().required(),

  query: Joi.object().required(),
});

/*
|--------------------------------------------------------------------------
| Update Router Validation
|--------------------------------------------------------------------------
| PUT /api/routers/:id
|--------------------------------------------------------------------------
*/

const updateRouterSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .trim()
      .required(),
  }).required(),

  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100),

    description: Joi.string()
      .trim()
      .max(500)
      .allow("", null),

    networkId: Joi.string()
      .trim(),

    gateway: Joi.string()
      .trim()
      .ip({
        version: ["ipv4"],
        cidr: "forbidden",
      })
      .allow("", null)
      .messages({
        "string.ip":
          "Gateway must be a valid IPv4 address",
      }),

    hourlyPrice: Joi.number()
      .min(0)
      .messages({
        "number.base":
          "Router hourly price must be a number",

        "number.min":
          "Router hourly price cannot be negative",
      }),

    ipAddress: Joi.string()
      .ip({
        version: ["ipv4", "ipv6"],
        cidr: "forbidden",
      })
      .allow(null, ""),

    macAddress: Joi.string()
      .trim()
      .allow(null, ""),

    status: Joi.string().valid(
      "active",
      "inactive",
      "online",
      "offline"
    ),
  })
    .min(1)
    .required(),
});

/*
|--------------------------------------------------------------------------
| Connect Network Validation
|--------------------------------------------------------------------------
*/

const connectNetworkSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .trim()
      .required(),
  }).required(),

  body: Joi.object({
    networkId: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required":
          "Network ID is required",

        "string.empty":
          "Network ID is required",
      }),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  createRouterSchema,
  updateRouterSchema,
  routerIdSchema,
  connectNetworkSchema,
};