const Joi = require("joi");

const validateNotifyReq = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  mailType: Joi.string().required(),
});
module.exports = {
  validateNotifyReq,
};
