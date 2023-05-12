const Joi = require('joi');

const validateaddMediaPostReq = Joi.object({
    title: Joi.string().required()
        .messages({
            'string.pattern.base': `"title" should be a type of 'text'`,
            'string.empty': `"title" cannot be an empty field`,
        }),
    description: Joi.string().required()
        .messages({
            'string.pattern.base': `"description" should be a type of 'text'`,
            'string.empty': `"description" cannot be an empty field`,
        }),
    type: Joi.string().required()
        .messages({
            'string.pattern.base': `"type" should be a type of 'text'`,
            'string.empty': `"type" cannot be an empty field`,
        }),
    media: Joi.string().required()
        .messages({
            'string.pattern.base': `"media" should be a type of 'text'`,
            'string.empty': `"media" cannot be an empty field`,
        }),
    file_name: Joi.string().required()
        .messages({
            'string.pattern.base': `"file_name" should be a type of 'text'`,
            'string.empty': `"file_name" cannot be an empty field`,
        }),
    slug: Joi.string().required()
        .messages({
            'string.pattern.base': `"slug" should be a type of 'text'`,
            'string.empty': `"slug" cannot be an empty field`,
        }),
    meta: Joi.string().required()
        .messages({
            'string.pattern.base': `"meta" should be a type of 'text'`,
            'string.empty': `"meta" cannot be an empty field`,
        }),
    status: Joi.array().items(Joi.string().trim().required()).messages({
        'string.empty': `"status" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    })
})

const validateupdateMediaPostReq = Joi.object({
    id: Joi.string().required()
        .messages({
            'string.pattern.base': `"id" should be a type of 'text'`,
            'string.empty': `"id" cannot be an empty field`,
        }),
    title: Joi.string()
        .messages({
            'string.pattern.base': `"title" should be a type of 'text'`,
            'string.empty': `"title" cannot be an empty field`,
        }),
    description: Joi.string()
        .messages({
            'string.pattern.base': `"description" should be a type of 'text'`,
            'string.empty': `"description" cannot be an empty field`,
        }),
    type: Joi.string()
        .messages({
            'string.pattern.base': `"type" should be a type of 'text'`,
            'string.empty': `"type" cannot be an empty field`,
        }),
    media: Joi.string()
        .messages({
            'string.pattern.base': `"media" should be a type of 'text'`,
            'string.empty': `"media" cannot be an empty field`,
        }),
    file_name: Joi.string()
        .messages({
            'string.pattern.base': `"file_name" should be a type of 'text'`,
            'string.empty': `"file_name" cannot be an empty field`,
        }),
    slug: Joi.string()
        .messages({
            'string.pattern.base': `"slug" should be a type of 'text'`,
            'string.empty': `"slug" cannot be an empty field`,
        }),
    meta: Joi.string()
        .messages({
            'string.pattern.base': `"meta" should be a type of 'text'`,
            'string.empty': `"meta" cannot be an empty field`,
        }),
    status: Joi.array().items(Joi.string().trim()).messages({
        'string.empty': `"status" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    })
})

module.exports = {
    validateaddMediaPostReq, validateupdateMediaPostReq
}