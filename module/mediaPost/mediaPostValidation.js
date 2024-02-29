const Joi = require("joi");

const validateaddMediaPostReq = Joi.object({
  contest_id: Joi.string().trim().required().messages({
    "string.empty": `"contest_id" cannot be an empty field`,
    "string.trim": `"contest_id" must not have leading or trailing whitespace`,
  }),
  title: Joi.string().required().messages({
    "string.pattern.base": `"title" should be a type of 'text'`,
    "string.empty": `"title" cannot be an empty field`,
  }),
  description: Joi.string().required().messages({
    "string.pattern.base": `"description" should be a type of 'text'`,
    "string.empty": `"description" cannot be an empty field`,
  }),
  //   type: Joi.string().required().messages({
  //     "string.pattern.base": `"type" should be a type of 'text'`,
  //     "string.empty": `"type" cannot be an empty field`,
  //   }),
  genres: Joi.array()
    .items(Joi.string().trim()) // Allow any object in the array
    .min(1)
    .required()
    .messages({
      "string.base": `{{#label}} should be a type of string`,
      "string.empty": `{{#label}} cannot be an empty field`,
      "any.required": `{{#label}} is a required field`,
      "array.base": `{{#label}} should be an array`,
      "array.min": `{{#label}} should contain at least 1 item`,
      "object.base": `{{#label}} should be of type object`,
    }),
  // media: Joi.string().required()
  //     .messages({
  //         'string.pattern.base': `"media" should be a type of 'text'`,
  //         'string.empty': `"media" cannot be an empty field`,
  //     }),
  // file_name: Joi.string().required()
  //     .messages({
  //         'string.pattern.base': `"file_name" should be a type of 'text'`,
  //         'string.empty': `"file_name" cannot be an empty field`,
  //     }),
  // slug: Joi.string().required()
  //     .messages({
  //         'string.pattern.base': `"slug" should be a type of 'text'`,
  //         'string.empty': `"slug" cannot be an empty field`,
  //     }),
  // meta: Joi.string().required()
  //     .messages({
  //         'string.pattern.base': `"meta" should be a type of 'text'`,
  //         'string.empty': `"meta" cannot be an empty field`,
  //     }),
  // status: Joi.array().items(Joi.string().trim().required()).messages({
  //     'string.empty': `"status" cannot be an empty field`,
  //     'string.trim': '{{#label}} must not have leading or trailing whitespace',
  // })
});
const validateContestParticipateVoteReq = Joi.object({
  contest_id: Joi.string().trim().required().messages({
    "string.empty": `"contest_id" cannot be an empty field`,
    "string.trim": `"contest_id" must not have leading or trailing whitespace`,
  }),
  participate_id: Joi.string().trim().required().messages({
    "string.empty": `"participate_id" cannot be an empty field`,
    "string.trim": `"participate_id" must not have leading or trailing whitespace`,
  }),
});
const validateaddToFavouriteReq = Joi.object({
  contest_id: Joi.string().trim().required().messages({
    "string.empty": `"contest_id" cannot be an empty field`,
    "string.trim": `"contest_id" must not have leading or trailing whitespace`,
  }),
  participate_id: Joi.string().trim().required().messages({
    "string.empty": `"participate_id" cannot be an empty field`,
    "string.trim": `"participate_id" must not have leading or trailing whitespace`,
  }),
});
const validateupdateMediaPostStatusReq = Joi.object({
  contest_id: Joi.string().trim().required().messages({
    "string.empty": `"contest_id" cannot be an empty field`,
    "string.trim": `"contest_id" must not have leading or trailing whitespace`,
  }),
  participate_id: Joi.string().trim().required().messages({
    "string.empty": `"participate_id" cannot be an empty field`,
    "string.trim": `"participate_id" must not have leading or trailing whitespace`,
  }),
  status: Joi.string()
    .trim()
    .valid("Rejected", "Under Review", "Active")
    .required()
    .messages({
      "string.empty": `"status" cannot be an empty field`,
      "string.trim": `"status" must not have leading or trailing whitespace`,
      "any.only": `"status" must be one of 'Rejected', 'Under Review', 'Active'`,
    }),
});

const validateUpdateLeastQuality = Joi.object({
  contest_id: Joi.string().trim().required().messages({
    "string.empty": `"contest_id" cannot be an empty field`,
    "string.trim": `"contest_id" must not have leading or trailing whitespace`,
  }),
  participate_id: Joi.string().trim().required().messages({
    "string.empty": `"participate_id" cannot be an empty field`,
    "string.trim": `"participate_id" must not have leading or trailing whitespace`,
  }),
  value: Joi.boolean().required().messages({
    "any.required": `"value" is required`,
    "boolean.base": `"value" must be a boolean`,
  }),
});

// const validateupdateMediaPostReq = Joi.object({
//     id: Joi.string().required()
//         .messages({
//             'string.pattern.base': `"id" should be a type of 'text'`,
//             'string.empty': `"id" cannot be an empty field`,
//         }),
//     title: Joi.string()
//         .messages({
//             'string.pattern.base': `"title" should be a type of 'text'`,
//             'string.empty': `"title" cannot be an empty field`,
//         }),
//     description: Joi.string()
//         .messages({
//             'string.pattern.base': `"description" should be a type of 'text'`,
//             'string.empty': `"description" cannot be an empty field`,
//         }),
//     type: Joi.string()
//         .messages({
//             'string.pattern.base': `"type" should be a type of 'text'`,
//             'string.empty': `"type" cannot be an empty field`,
//         }),
//     media: Joi.string()
//         .messages({
//             'string.pattern.base': `"media" should be a type of 'text'`,
//             'string.empty': `"media" cannot be an empty field`,
//         }),
//     file_name: Joi.string()
//         .messages({
//             'string.pattern.base': `"file_name" should be a type of 'text'`,
//             'string.empty': `"file_name" cannot be an empty field`,
//         }),
//     slug: Joi.string()
//         .messages({
//             'string.pattern.base': `"slug" should be a type of 'text'`,
//             'string.empty': `"slug" cannot be an empty field`,
//         }),
//     meta: Joi.string()
//         .messages({
//             'string.pattern.base': `"meta" should be a type of 'text'`,
//             'string.empty': `"meta" cannot be an empty field`,
//         }),
//     status: Joi.array().items(Joi.string().trim()).messages({
//         'string.empty': `"status" cannot be an empty field`,
//         'string.trim': '{{#label}} must not have leading or trailing whitespace',
//     })
// })

module.exports = {
  validateaddMediaPostReq,
  validateContestParticipateVoteReq,
  validateaddToFavouriteReq,
  validateupdateMediaPostStatusReq,
  validateUpdateLeastQuality,
};
