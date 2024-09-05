const Joi = require("joi");

const validateAddInquiryReq = Joi.object({
  inq_type: Joi.string().required().messages({
    "string.empty": `"inq_type" cannot be an empty field`,
  }),
  first_name: Joi.string().required().messages({
    "string.empty": `"first_name" cannot be an empty field`,
  }),
  last_name: Joi.string().required().messages({
    "string.empty": `"last_name" cannot be an empty field`,
  }),
  email: Joi.string().email().required().messages({
    "string.email": `"email" must be a valid email`,
    "string.empty": `"email" cannot be an empty field`,
  }),
  phone: Joi.string().required().messages({
    "string.empty": `"phone" cannot be an empty field`,
  }),
  company: Joi.string().optional().allow("").messages({
    "string.empty": `"company" cannot be an empty field`,
  }),
  city: Joi.string().required().messages({
    "string.empty": `"city" cannot be an empty field`,
  }),
  country: Joi.string().required().messages({
    "string.empty": `"country" cannot be an empty field`,
  }),
  message: Joi.string().required().messages({
    "string.empty": `"message" cannot be an empty field`,
  }),
  interview: Joi.boolean().optional().default(false).messages({
    "boolean.base": `"interview" should be true or false`,
  }),
});

module.exports = {
  validateAddInquiryReq,
};
