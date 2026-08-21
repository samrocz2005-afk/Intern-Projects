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
| Create Instance
|--------------------------------------------------------------------------
| POST /api/instances
|--------------------------------------------------------------------------
*/

const createInstanceSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required(),

    flavor: objectId.required(),

    network: objectId.allow(null),

    operatingSystem: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required(),

    sshKeyName: Joi.string()
      .trim()
      .max(100)
      .allow(null, ""),
  }).required(),

  params: Joi.object().required(),

  query: Joi.object().required(),
});

/*
|--------------------------------------------------------------------------
| Update Instance
|--------------------------------------------------------------------------
| PUT /api/instances/:id
|--------------------------------------------------------------------------
*/

const updateInstanceSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50),

    sshKeyName: Joi.string()
      .trim()
      .max(100)
      .allow(null, ""),
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
| Instance ID
|--------------------------------------------------------------------------
| GET /api/instances/:id
| DELETE /api/instances/:id
| POST /api/instances/:id/start
| POST /api/instances/:id/stop
| POST /api/instances/:id/restart
|--------------------------------------------------------------------------
*/

const instanceIdSchema = Joi.object({
  params: Joi.object({
    id: objectId.required(),
  }).required(),

  query: Joi.object().required(),
});

/*
|--------------------------------------------------------------------------
| List Instances
|--------------------------------------------------------------------------
| GET /api/instances
|--------------------------------------------------------------------------
*/

const listInstancesSchema = Joi.object({
  params: Joi.object().required(),

  query: Joi.object({
    status: Joi.string().valid(
      "pending",
      "running",
      "stopped",
      "restarting",
      "terminated",
      "error"
    ),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
  createInstanceSchema,
  updateInstanceSchema,
  instanceIdSchema,
  listInstancesSchema,
};