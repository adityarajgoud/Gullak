const Joi = require("joi");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errorMessages,
    });
  }
  next();
};

// Common Schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(6).required(),
  }),
  login: Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required(),
  }),
  updateProfile: Joi.object({
    name: Joi.string().trim(),
    email: Joi.string().email().trim(),
  }),
  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  }),
  transaction: Joi.object({
    type: Joi.string().valid("income", "expense").required(),
    amount: Joi.number().positive().required(),
    category: Joi.string().required().trim(),
    date: Joi.date().default(Date.now),
    note: Joi.string().allow("").max(250).optional(),
  }),
  category: Joi.object({
    name: Joi.string().required().trim(),
  }),
};

module.exports = { validate, schemas };
