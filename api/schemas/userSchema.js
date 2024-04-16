const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
  username: Joi.string().trim().required(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z])\.{6,}$/)
    .required(),
  mobileNumber: Joi.string().trim().optional().pattern(/^\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}$/),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
  username: Joi.string().trim().optional(),
  mobileNumber: Joi.string().trim().optional().pattern(/^\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}$/),
});

module.exports = { registerSchema, updateProfileSchema };