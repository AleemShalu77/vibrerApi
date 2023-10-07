const Joi = require("joi");

const validateAddProjectReq = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  city: Joi.string().required(),
  link: Joi.string().uri().required(),
});
module.exports = {
  validateAddProjectReq,
};
