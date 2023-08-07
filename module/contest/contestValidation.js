const Joi = require('joi');
const validateAddContestReq = Joi.object({
  contest_type: Joi.string().required(),
title: Joi.string().required().trim().regex(/^[A-Za-z\s]+$/).messages({
  'string.pattern.base': 'Title should only contain alphabets',
  'string.empty': 'Title is required'
}),
description: Joi.string().required(),
conditions: Joi.string().required(),
reward: Joi.string().required(),
time_zone: Joi.string().required(),
starts_on: Joi.object({
    start_date: Joi.date().required(),
    start_time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
}).required(),
ends_on: Joi.object({
    end_date: Joi.date().required(),
    end_time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required()
}).required(),
banner: Joi.object({
    xl: Joi.string().required(),
    l: Joi.string().required(),
    m: Joi.string().required()
}).required(),
  status: Joi.string().required().valid('Deactive', 'Active', 'Archived').messages({
    'string.empty': `"status" cannot be an empty field`,
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
  }),
  publish: Joi.string().required().valid('Publish', 'Draft').messages({
    'string.empty': `"publish" cannot be an empty field`,
    'string.trim': '{{#label}} must not have leading or trailing whitespace',
  })
});
const validateUpdateContestReq = Joi.object({});

module.exports = {
 validateAddContestReq, validateUpdateContestReq
}