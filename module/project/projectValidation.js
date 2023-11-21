const Joi = require("joi");

const validateAddProjectReq = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  link: Joi.string().uri().required(),
  message: Joi.string().min(1).max(500),
});
module.exports = {
  validateAddProjectReq,
};
