const Joi = require("joi");

// Common regex patterns
const namePattern = /^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

// Add User Validation
const validateAddUserReq = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .pattern(namePattern)
    .required()
    .messages({
      "string.pattern.base": `"firstName" should be a valid name`,
      "string.empty": `"firstName" cannot be an empty field`,
      "string.min": `"firstName" should have a minimum length of {#limit}`,
      "string.max": `"firstName" should have a maximum length of {#limit}`,
      "string.trim": `"firstName" must not have leading or trailing whitespace`,
    }),
  lastName: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .pattern(namePattern)
    .required()
    .messages({
      "string.pattern.base": `"lastName" should be a valid name`,
      "string.empty": `"lastName" cannot be an empty field`,
      "string.min": `"lastName" should have a minimum length of {#limit}`,
      "string.max": `"lastName" should have a maximum length of {#limit}`,
      "string.trim": `"lastName" must not have leading or trailing whitespace`,
    }),
  role: Joi.string().required().messages({
    "string.empty": `"role" cannot be an empty field`,
  }),
  email: Joi.string().email().trim().required().messages({
    "string.email": `"email" must be a valid email`,
    "string.empty": `"email" cannot be an empty field`,
    "string.trim": `"email" must not have leading or trailing whitespace`,
  }),
  createdBy: Joi.number().integer().required().messages({
    "number.base": `"createdBy" should be a number`,
    "any.required": `"createdBy" is required`,
  }),
  updatedBy: Joi.number().integer().required().messages({
    "number.base": `"updatedBy" should be a number`,
    "any.required": `"updatedBy" is required`,
  }),
  status: Joi.string().required().messages({
    "string.empty": `"status" cannot be an empty field`,
  }),
  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .min(8)
    .max(16)
    .messages({
      "string.pattern.base": `"password" must have at least one uppercase letter, one number, and one special character`,
      "string.empty": `"password" cannot be an empty field`,
      "string.min": `"password" should have a minimum length of {#limit}`,
      "string.max": `"password" should have a maximum length of {#limit}`,
    }),
});

// Update User Validation
const validateUpdateUserReq = Joi.object({
  id: Joi.string().required().messages({
    "string.base": `"id" must be a string`,
    "string.empty": `"id" cannot be an empty field`,
  }),
  firstName: Joi.string().min(3).max(50).trim().pattern(namePattern).messages({
    "string.pattern.base": `"firstName" should be a valid name`,
    "string.min": `"firstName" should have a minimum length of {#limit}`,
    "string.max": `"firstName" should have a maximum length of {#limit}`,
    "string.trim": `"firstName" must not have leading or trailing whitespace`,
  }),
  lastName: Joi.string().min(3).max(50).trim().pattern(namePattern).messages({
    "string.pattern.base": `"lastName" should be a valid name`,
    "string.min": `"lastName" should have a minimum length of {#limit}`,
    "string.max": `"lastName" should have a maximum length of {#limit}`,
    "string.trim": `"lastName" must not have leading or trailing whitespace`,
  }),
  role: Joi.string().messages({
    "string.base": `"role" must be a string`,
    "string.empty": `"role" cannot be an empty field`,
  }),
  email: Joi.string().email().trim().messages({
    "string.email": `"email" must be a valid email`,
    "string.trim": `"email" must not have leading or trailing whitespace`,
  }),
  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .min(8)
    .max(16)
    .messages({
      "string.pattern.base": `"password" must have at least one uppercase letter, one number, and one special character`,
      "string.empty": `"password" cannot be an empty field`,
      "string.min": `"password" should have a minimum length of {#limit}`,
      "string.max": `"password" should have a maximum length of {#limit}`,
    }),
  isVerified: Joi.boolean().messages({
    "boolean.base": `"isVerified" must be a boolean`,
  }),
  // updatedBy: Joi.number().integer().messages({
  //   "number.base": `"updatedBy" should be a number`,
  // }),
  status: Joi.string().required().messages({
    "string.empty": `"status" cannot be an empty field`,
  }),
});

// Login Validation
const validateLoginReq = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.email": `"email" must be a valid email`,
    "string.empty": `"email" cannot be an empty field`,
    "string.trim": `"email" must not have leading or trailing whitespace`,
  }),
  password: Joi.string().required().messages({
    "string.empty": `"password" cannot be an empty field`,
  }),
});

// Forgot Password Validation
const validateForgotPasswordReq = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.email": `"email" must be a valid email`,
    "string.empty": `"email" cannot be an empty field`,
    "string.trim": `"email" must not have leading or trailing whitespace`,
  }),
});

// Reset Password Validation
const validateResetPasswordReq = Joi.object({
  token: Joi.string().trim().required().messages({
    "string.empty": `"token" cannot be an empty field`,
    "string.trim": `"token" must not have leading or trailing whitespace`,
  }),
  password: Joi.string()
    .pattern(passwordRegex)
    .required()
    .min(8)
    .max(16)
    .messages({
      "string.pattern.base": `"password" must have at least one uppercase letter, one number, and one special character`,
      "string.empty": `"password" cannot be an empty field`,
      "string.min": `"password" should have a minimum length of {#limit}`,
      "string.max": `"password" should have a maximum length of {#limit}`,
    }),
  confirmPassword: Joi.string().required().valid(Joi.ref("password")).messages({
    "any.only": `"confirmPassword" does not match "password"`,
    "string.empty": `"confirmPassword" cannot be an empty field`,
  }),
});

// Verification Code Validation
const validateVerificationCodeReq = Joi.object({
  token: Joi.string().trim().required().messages({
    "string.empty": `"token" cannot be an empty field`,
    "string.trim": `"token" must not have leading or trailing whitespace`,
  }),
});

module.exports = {
  validateAddUserReq,
  validateUpdateUserReq,
  validateLoginReq,
  validateForgotPasswordReq,
  validateResetPasswordReq,
  validateVerificationCodeReq,
};
