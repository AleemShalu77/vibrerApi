const Joi = require('joi');
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;

const validateAddUserReq = Joi.object({
  first_name: Joi.string().min(3).max(50).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .required()
    .messages({
      'string.pattern.base': `"first_name" should be a type of 'text'`,
      'string.empty': `"first_name" cannot be an empty field`,
      'string.min': `"first_name" should have a minimum length of {#limit}`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
  last_name: Joi.string().min(3).max(50).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .required()
    .messages({
      'string.pattern.base': `"last_name" should be a type of 'text'`,
      'string.empty': `"last_name" cannot be an empty field`,
      'string.min': `"last_name" should have a minimum length of {#limit}`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
  role: Joi.string().required()
    .messages({
      'string.pattern.base': `"last_name" should be a type of 'text'`,
      'string.empty': `"last_name" cannot be an empty field`,
    }),
  email: Joi.string().email().trim().required().messages({
    'string.email': '{{#label}} must be a valid email',
    'string.empty': `"email" cannot be an empty field`,
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
  }),
  verification: Joi.string().required()
    .messages({
      'string.pattern.base': `"last_name" should be a type of 'text'`,
      'string.empty': `"last_name" cannot be an empty field`,
    }),
  createdBy: Joi.number().integer().required()
    .messages({
      'number.pattern.base': `"createdBy" should be a type of 'number'`,
      'number.empty': `"createdBy" cannot be an empty field`,
    }),
  updatedBy: Joi.number().integer().required()
    .messages({
      'number.pattern.base': `"updatedBy" should be a type of 'number'`,
      'number.empty': `"updatedBy" cannot be an empty field`,
    }),
  status: Joi.string().required().messages({
    'string.empty': `"status" cannot be an empty field`,
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
  }),
  password: Joi.string()
    .regex(RegExp(passwordRegex))
    .required()
    .min(8)
    .max(16)
    .message({
      'string.pattern.base': `"password" must have atleast one uppercase letter, one number and one speacial character`,
      'string.empty': `"password" cannot be an empty field`,
      'string.min': `"password" should have a minimum length of {#limit}`,
      'string.min': `"password" should have a maximum length of {#limit}`,
    })
});

const validateUpdateUserReq = Joi.object({
  id: Joi.string().required()
    .messages({
      'string.pattern.base': `"id" should be a type of 'text'`,
      'string.empty': `"id" cannot be an empty field`,
    }),
  first_name: Joi.string().min(3).max(50).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .messages({
      'string.pattern.base': `"first_name" should be a type of 'text'`,
      'string.empty': `"first_name" cannot be an empty field`,
      'string.min': `"first_name" should have a minimum length of {#limit}`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
  last_name: Joi.string().min(3).max(50).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .messages({
      'string.pattern.base': `"last_name" should be a type of 'text'`,
      'string.empty': `"last_name" cannot be an empty field`,
      'string.min': `"last_name" should have a minimum length of {#limit}`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
  role: Joi.string()
    .messages({
      'string.pattern.base': `"last_name" should be a type of 'text'`,
      'string.empty': `"last_name" cannot be an empty field`,
    }),
  email: Joi.string().email().trim()
    .messages({
      'string.email': '{{#label}} must be a valid email',
      'string.empty': `"email" cannot be an empty field`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
  verification: Joi.string()
    .messages({
      'string.pattern.base': `"last_name" should be a type of 'text'`,
      'string.empty': `"last_name" cannot be an empty field`,
    }),
  createdBy: Joi.number().integer()
    .messages({
      'number.pattern.base': `"createdBy" should be a type of 'number'`,
      'number.empty': `"createdBy" cannot be an empty field`,
    }),
  updatedBy: Joi.number().integer()
    .messages({
      'number.pattern.base': `"updatedBy" should be a type of 'number'`,
      'number.empty': `"updatedBy" cannot be an empty field`,
    }),
  status: Joi.string().required().messages({
    'string.empty': `"status" cannot be an empty field`,
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
  }),
});

const validateLoginReq = Joi.object({
  email: Joi.string().email().trim().required()
  .messages({
    'string.email': '{{#label}} must be a valid email',
    'string.empty': `"email" cannot be an empty field`,
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
  }),
  password:Joi.string().required()
  .messages({
    'string.empty': `"password" cannot be an empty field`,
  })
})

module.exports = {
  validateAddUserReq,
  validateUpdateUserReq,
  validateLoginReq
}