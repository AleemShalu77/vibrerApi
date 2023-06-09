const Joi = require('joi');
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
const urlRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

const validateAddUserfanReq = Joi.object({
    email: Joi.string().email().trim().required().messages({
        'string.email': '{{#label}} must be a valid email',
        'string.empty': `"email" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    password: Joi.string()
        .regex(RegExp(passwordRegex))
        .required()
        .min(8)
        .max(16)
        .message({
            'string.pattern.base': `"password" must have atleast one uppercase letter, one number and one speacial character`,
            'string.empty': `"password" cannot be an empty field`,
            'string.min': `"password" should have a minimum length of {#limit}`,
            'string.min': `"password" should have a maximum length of {#limit}`,
        }),
    first_name: Joi.string().min(3).max(50).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
        .required()
        .messages({
            'string.pattern.base': `"first_name" should be a type of 'text'`,
            'string.empty': `"first_name" cannot be an empty field`,
            'string.min': `"first_name" should have a minimum length of {#limit}`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
    last_name: Joi.string().min(3).max(50).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
        .required()
        .messages({
            'string.pattern.base': `"last_name" should be a type of 'text'`,
            'string.empty': `"last_name" cannot be an empty field`,
            'string.min': `"last_name" should have a minimum length of {#limit}`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
    city: Joi.string().trim().required().messages({
        'string.empty': `"city" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    state: Joi.string().trim().required().messages({
        'string.empty': `"state" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    country: Joi.string().trim().required().messages({
        'string.empty': `"country" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    concert_fan: Joi.boolean().required(),
    visibility: Joi.boolean().required(),
    chat: Joi.string().trim().required().messages({
        'string.empty': `"chat" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    bio: Joi.string().trim().required().messages({
        'string.empty': `"bio" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    status: Joi.array().items(Joi.string().trim().required()).messages({
        'string.empty': `"status" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    })
})

const validateUpdateUserfanReq = Joi.object({
    id: Joi.string().required()
        .messages({
            'string.pattern.base': `"id" should be a type of 'text'`,
            'string.empty': `"id" cannot be an empty field`,
        }),
        email: Joi.string().email().trim().messages({
            'string.email': '{{#label}} must be a valid email',
            'string.empty': `"email" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
        first_name: Joi.string().min(3).max(50).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
            .messages({
                'string.pattern.base': `"first_name" should be a type of 'text'`,
                'string.empty': `"first_name" cannot be an empty field`,
                'string.min': `"first_name" should have a minimum length of {#limit}`,
                'string.trim': '{{#label}} must not have leading or trailing whitespace',
            }),
        last_name: Joi.string().min(3).max(50).trim().regex(/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/)
            .messages({
                'string.pattern.base': `"last_name" should be a type of 'text'`,
                'string.empty': `"last_name" cannot be an empty field`,
                'string.min': `"last_name" should have a minimum length of {#limit}`,
                'string.trim': '{{#label}} must not have leading or trailing whitespace',
            }),
        city: Joi.string().trim().messages({
            'string.empty': `"city" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
        state: Joi.string().trim().messages({
            'string.empty': `"state" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
        country: Joi.string().trim().messages({
            'string.empty': `"country" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
        concert_fan: Joi.boolean(),
        visibility: Joi.boolean(),
        chat: Joi.string().trim().messages({
            'string.empty': `"chat" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
        bio: Joi.string().trim().messages({
            'string.empty': `"bio" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
        status: Joi.array().items(Joi.string().trim()).messages({
            'string.empty': `"status" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        })
})

const validateLoginReq = Joi.object({
    email: Joi.string().email().trim().required()
        .messages({
            'string.email': '{{#label}} must be a valid email',
            'string.empty': `"email" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
    password: Joi.string().required()
        .messages({
            'string.empty': `"password" cannot be an empty field`,
        })
})

const validateResetPasswordReq = Joi.object({
    email: Joi.string().email().trim().required()
        .messages({
            'string.email': '{{#label}} must be a valid email',
            'string.empty': `"email" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
        }),
    password: Joi.string()
        .regex(RegExp(passwordRegex))
        .required()
        .min(8)
        .max(16)
        .message({
            'string.pattern.base': `"password" must have atleast one uppercase letter, one number and one speacial character`,
            'string.empty': `"password" cannot be an empty field`,
            'string.min': `"password" should have a minimum length of {#limit}`,
            'string.min': `"password" should have a maximum length of {#limit}`,
        }),
    confirmPassword: Joi.string()
        .regex(RegExp(passwordRegex))
        .required()
        .min(8)
        .max(16)
        .message({
            'string.pattern.base': `"password" must have atleast one uppercase letter, one number and one speacial character`,
            'string.empty': `"password" cannot be an empty field`,
            'string.min': `"password" should have a minimum length of {#limit}`,
            'string.min': `"password" should have a maximum length of {#limit}`,
        })
})


module.exports = {
    validateAddUserfanReq, validateUpdateUserfanReq, validateLoginReq, validateResetPasswordReq
}
