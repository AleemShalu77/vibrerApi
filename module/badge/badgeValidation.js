const Joi = require('joi');

const validateAddBadgeReq = Joi.object({
  icons: Joi.required().messages({
    'string.empty': `"icons" cannot be an empty field`,
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
  }),
  status: Joi.string().required().valid('Deactive', 'Active').messages({
    'string.empty': `"status" cannot be an empty field`,
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
  })
});

const validateUpdateBadgeReq = Joi.object({
  id: Joi.string().required()
    .messages({
      'string.pattern.base': `"id" should be a type of 'text'`,
      'string.empty': `"id" cannot be an empty field`,
    }),
    icons: Joi.string().trim().required().messages({
      'string.empty': `"icons" cannot be an empty field`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    status: Joi.string().required().valid('Deactive', 'Active').messages({
      'string.empty': `"status" cannot be an empty field`,
      'string.trim': '{{#label}} must not have leading or trailing whitespace',
    })
});


module.exports = {
  validateAddBadgeReq, validateUpdateBadgeReq
}