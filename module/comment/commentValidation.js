const Joi = require('joi');

const validateAddCommentReq = Joi.object({
    description: Joi.string().min(3).max(250).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .required()
    .messages({
        'string.pattern.base': `"description" should be a type of 'text'`,
        'string.empty': `"description" cannot be an empty field`,
        'string.min': `"description" should have a minimum length of {#limit}`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    createdBy: Joi.number().integer().required()
    .messages({
      'number.pattern.base': `"createdBy" should be a type of 'number'`,
      'number.empty': `"createdBy" cannot be an empty field`,
   }),
    status: Joi.array().items(Joi.string().trim().required()).messages({
      'string.empty': `"status" cannot be an empty field`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
});

const validateUpdateCommentReq = Joi.object({
  id:Joi.string().required()
  .messages({
    'string.pattern.base': `"id" should be a type of 'text'`,
    'string.empty': `"id" cannot be an empty field`,
    }),
    description: Joi.string().min(3).max(250).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
    .messages({
        'string.pattern.base': `"description" should be a type of 'text'`,
        'string.empty': `"description" cannot be an empty field`,
        'string.min': `"description" should have a minimum length of {#limit}`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    createdBy: Joi.number().integer()
    .messages({
      'number.pattern.base': `"createdBy" should be a type of 'number'`,
      'number.empty': `"createdBy" cannot be an empty field`,
   }),
    status: Joi.array().items(Joi.string().trim()).messages({
      'string.empty': `"status" cannot be an empty field`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
});


  module.exports = {
    validateAddCommentReq,validateUpdateCommentReq
  }