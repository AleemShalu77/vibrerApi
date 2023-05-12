const Joi = require('joi');

const validateAddPlatformCommissionReq = Joi.object({
    name: Joi.string().min(3).max(250).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
        .required()
        .messages({
            'string.pattern.base': `"name" should be a type of 'text'`,
            'string.empty': `"name" cannot be an empty field`,
            'string.min': `"name" should have a minimum length of {#limit}`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
    value: Joi.number().integer().required()
        .messages({
            'number.pattern.base': `"value" should be a type of 'number'`,
            'number.empty': `"value" cannot be an empty field`,
        }),
    status: Joi.array().items(Joi.string().trim().required()).messages({
        'string.empty': `"status" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
});

const validateUpdatePlatformCommissionReq = Joi.object({
    id: Joi.string().required()
        .messages({
            'string.pattern.base': `"id" should be a type of 'text'`,
            'string.empty': `"id" cannot be an empty field`,
        }),
    name: Joi.string().min(3).max(250).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
        .messages({
            'string.pattern.base': `"name" should be a type of 'text'`,
            'string.empty': `"name" cannot be an empty field`,
            'string.min': `"name" should have a minimum length of {#limit}`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
    value: Joi.number().integer()
        .messages({
            'number.pattern.base': `"value" should be a type of 'number'`,
            'number.empty': `"value" cannot be an empty field`,
        }),
    status: Joi.array().items(Joi.string().trim()).messages({
        'string.empty': `"status" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
});


module.exports = {
    validateAddPlatformCommissionReq, validateUpdatePlatformCommissionReq
}