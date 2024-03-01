const Joi = require("joi");

const validateSubmitReportReq = Joi.object({
  contest_id: Joi.string().trim().required().messages({
    "string.empty": `"contest_id" cannot be an empty field`,
    "string.trim": `"contest_id" must not have leading or trailing whitespace`,
    "any.required": `"contest_id" is a required field`,
  }),
  entry_id: Joi.string().trim().required().messages({
    "string.empty": `"entry_id" cannot be an empty field`,
    "string.trim": `"entry_id" must not have leading or trailing whitespace`,
    "any.required": `"entry_id" is a required field`,
  }),
  content_type: Joi.string().trim().required().messages({
    "string.empty": `"content_type" cannot be an empty field`,
    "string.trim": `"content_type" must not have leading or trailing whitespace`,
    "any.required": `"content_type" is a required field`,
  }),
  report_reason: Joi.string().trim().allow("").messages({
    // Allow empty string
    "string.empty": `"report_reason" cannot be an empty field`,
    "string.trim": `"report_reason" must not have leading or trailing whitespace`,
  }),
  company: Joi.string().trim().allow("").messages({
    "string.trim": `"company" must not have leading or trailing whitespace`,
  }),
  contact_email: Joi.string().trim().email().allow("").messages({
    "string.email": `"contact_email" must be a valid email address`,
    "string.trim": `"contact_email" must not have leading or trailing whitespace`,
  }),
  report_description: Joi.string().trim().allow("").messages({
    "string.empty": `"report_description" cannot be an empty field`,
    "string.trim": `"report_description" must not have leading or trailing whitespace`,
    "any.required": `"report_description" is a required field`,
  }),
  status: Joi.string().trim().optional().messages({
    "string.empty": `"status" cannot be an empty field`,
    "string.trim": `"status" must not have leading or trailing whitespace`,
    "any.only": `"status" must be one of 'Rejected', 'Under Review', 'Active'`,
  }),
});

module.exports = {
  validateSubmitReportReq,
};
