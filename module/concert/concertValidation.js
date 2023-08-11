const Joi = require('joi');

const validateAddConcertReq = Joi.object({
  concert_type: Joi.string().required(),
    artist: Joi.string().required(),
    title: Joi.string().required().trim().regex(/^[A-Za-z\s]+$/).messages({
      'string.pattern.base': 'Title should only contain alphabets',
      'string.empty': 'Title is required'
    }),
    description: Joi.string().required(),
    price: Joi.number().required(),
    time_zone: Joi.string().required(),
    concert_date: Joi.date().required(),
    concert_time: Joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
    tags: Joi.array().items(Joi.string()).required(),
    password: Joi.string().required(),
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



module.exports = {
  validateAddConcertReq
}