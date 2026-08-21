const Joi = require("joi");

const objectId = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.pattern.base": "Invalid MongoDB ID",
  });

// Get billing list
const listBillingSchema = Joi.object({
  body: Joi.object().required(),

  params: Joi.object().required(),

  query: Joi.object({
    status: Joi.string().valid(
      "draft",
      "pending",
      "paid",
      "failed",
      "cancelled"
    ),

    startDate: Joi.date()
      .iso()
      .optional(),

    endDate: Joi.date()
      .iso()
      .min(Joi.ref("startDate"))
      .optional(),

    page: Joi.number()
      .integer()
      .min(1)
      .default(1),

    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(20),
  }).required(),
});

// Get one billing record
const billingIdSchema = Joi.object({
  body: Joi.object().required(),

  params: Joi.object({
    id: objectId.required(),
  }).required(),

  query: Joi.object().required(),
});

// Admin/manual billing generation
const generateBillingSchema = Joi.object({
  body: Joi.object({
    userId: objectId.required(),

    periodStart: Joi.date()
      .iso()
      .required(),

    periodEnd: Joi.date()
      .iso()
      .greater(Joi.ref("periodStart"))
      .required(),
  }).required(),

  params: Joi.object().required(),

  query: Joi.object().required(),
});

module.exports = {
  listBillingSchema,
  billingIdSchema,
  generateBillingSchema,
};