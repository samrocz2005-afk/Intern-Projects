const Joi = require("joi");

const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        "string.empty": "Name is required",
        "string.min":
          "Name must be at least 2 characters",
        "string.max":
          "Name cannot exceed 50 characters",
      }),

    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .max(100)
      .required()
      .messages({
        "string.email":
          "Please provide a valid email address",
        "string.empty": "Email is required",
      }),

    password: Joi.string()
      .min(8)
      .max(100)
      .required()
      .messages({
        "string.min":
          "Password must be at least 8 characters",
        "string.empty": "Password is required",
      }),
  }).required(),

  params: Joi.object().required(),

  query: Joi.object().required(),
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .trim()
      .lowercase()
      .email()
      .required(),

    password: Joi.string()
      .min(1)
      .required(),
  }).required(),

  params: Joi.object().required(),

  query: Joi.object().required(),
});

const changePasswordSchema = Joi.object({
  body: Joi.object({
    currentPassword: Joi.string()
      .required(),

    newPassword: Joi.string()
      .min(8)
      .max(100)
      .required(),

    confirmPassword: Joi.any()
      .valid(Joi.ref("newPassword"))
      .required()
      .messages({
        "any.only":
          "Passwords do not match",
      }),
  }).required(),

  params: Joi.object().required(),

  query: Joi.object().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
};