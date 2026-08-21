const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| Load Balancer ID Validation
|--------------------------------------------------------------------------
*/

const loadBalancerIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .trim()
      .required(),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Create Load Balancer Validation
|--------------------------------------------------------------------------
*/

const createLoadBalancerSchema = Joi.object({
  body: Joi.object({
    /*
     * Load Balancer Name
     */
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required()
      .messages({
        "string.empty":
          "Load balancer name is required",
        "string.min":
          "Load balancer name must be at least 2 characters",
        "string.max":
          "Load balancer name cannot exceed 100 characters",
      }),

    /*
     * Description
     */
    description: Joi.string()
      .trim()
      .max(500)
      .allow("", null),

    /*
     * Load Balancing Algorithm
     *
     * Backend enum:
     * round_robin
     * least_connections
     * ip_hash
     * random
     */
    algorithm: Joi.string()
      .valid(
        "round_robin",
        "least_connections",
        "ip_hash",
        "random"
      )
      .default("round_robin")
      .messages({
        "any.only":
          "Algorithm must be one of [round_robin, least_connections, ip_hash, random]",
      }),

    /*
     * Listener Port
     */
    listenerPort: Joi.number()
      .integer()
      .min(1)
      .max(65535)
      .required()
      .messages({
        "any.required":
          "Listener port is required",
        "number.min":
          "Listener port must be between 1 and 65535",
        "number.max":
          "Listener port must be between 1 and 65535",
      }),

    /*
     * Target Port
     */
    targetPort: Joi.number()
      .integer()
      .min(1)
      .max(65535)
      .required()
      .messages({
        "any.required":
          "Target port is required",
        "number.min":
          "Target port must be between 1 and 65535",
        "number.max":
          "Target port must be between 1 and 65535",
      }),

    /*
     * Protocol
     *
     * Backend expects uppercase enum values.
     */
    protocol: Joi.string()
      .valid(
        "HTTP",
        "HTTPS",
        "TCP"
      )
      .default("HTTP")
      .messages({
        "any.only":
          "Protocol must be one of [HTTP, HTTPS, TCP]",
      }),

    /*
     * Health Check
     */
    healthCheck: Joi.boolean()
      .default(true),

    /*
     * Hourly Price
     */
    hourlyPrice: Joi.number()
      .min(0)
      .required()
      .messages({
        "any.required":
          "Load balancer hourly price is required",
        "number.min":
          "Load balancer hourly price cannot be negative",
      }),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Add Backend Validation
|--------------------------------------------------------------------------
*/

const addBackendSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .trim()
      .required(),
  }).required(),

  body: Joi.object({
    instanceId: Joi.string()
      .trim()
      .required(),

    weight: Joi.number()
      .integer()
      .min(1)
      .default(1),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Remove Backend Validation
|--------------------------------------------------------------------------
*/

const removeBackendSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .trim()
      .required(),

    backendId: Joi.string()
      .trim()
      .required(),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Update Backend Health Validation
|--------------------------------------------------------------------------
*/

const updateBackendHealthSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .trim()
      .required(),

    backendId: Joi.string()
      .trim()
      .required(),
  }).required(),

  body: Joi.object({
    healthy: Joi.boolean()
      .required(),

    message: Joi.string()
      .trim()
      .max(500)
      .allow("", null),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  createLoadBalancerSchema,
  loadBalancerIdSchema,
  addBackendSchema,
  removeBackendSchema,
  updateBackendHealthSchema,
};