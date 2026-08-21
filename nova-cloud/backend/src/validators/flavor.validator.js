const Joi = require("joi");

/*
|--------------------------------------------------------------------------
| Flavor ID Validation
|--------------------------------------------------------------------------
*/

const flavorIdSchema = Joi.object({
  params: Joi.object({
    id: Joi.string()
      .trim()
      .required(),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Create Flavor Validation
|--------------------------------------------------------------------------
*/

const createFlavorSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(100)
      .required(),

    description: Joi.string()
      .trim()
      .max(300)
      .allow("", null),

    vcpus: Joi.number()
      .integer()
      .min(1)
      .required(),

    ram: Joi.number()
      .positive()
      .required(),

    disk: Joi.number()
      .positive()
      .required(),

    hourlyPrice: Joi.number()
      .min(0)
      .required(),

    monthlyPrice: Joi.number()
      .min(0)
      .allow(null)
      .default(null),

    isActive: Joi.boolean()
      .default(true),
  }).required(),
});

/*
|--------------------------------------------------------------------------
| Update Flavor Validation
|--------------------------------------------------------------------------
*/

const updateFlavorSchema = Joi.object({
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
      .max(300)
      .allow("", null),

    vcpus: Joi.number()
      .integer()
      .min(1),

    ram: Joi.number()
      .positive(),

    disk: Joi.number()
      .positive(),

    hourlyPrice: Joi.number()
      .min(0),

    monthlyPrice: Joi.number()
      .min(0)
      .allow(null),

    isActive: Joi.boolean(),
  })
    .min(1)
    .required(),
});

/*
|--------------------------------------------------------------------------
| List Flavors Validation
|--------------------------------------------------------------------------
*/

const listFlavorsSchema = Joi.object({
  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20),

    search: Joi.string()
      .trim()
      .allow("")
      .default(""),

    isActive: Joi.boolean(),

    sortBy: Joi.string()
      .valid(
        "name",
        "vcpus",
        "ram",
        "disk",
        "hourlyPrice",
        "monthlyPrice",
        "createdAt"
      )
      .default("createdAt"),

    sortOrder: Joi.string()
      .valid("asc", "desc")
      .default("desc"),
  }).default({}),

  params: Joi.object().default({}),
});

module.exports = {
  flavorIdSchema,
  createFlavorSchema,
  updateFlavorSchema,
  listFlavorsSchema,
};