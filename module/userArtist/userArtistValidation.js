const Joi = require('joi');
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
const urlRegex = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;

const validateAddUserArtistReq = Joi.object({
    user_type: Joi.string().required().valid('Artist', 'Fan').messages({
        'string.empty': `"user_type" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
      }),
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
    username: Joi.string().trim().required().messages({
        'string.empty': `"username" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    artist_categories: Joi.array()
    .items(Joi.string().trim()) // Allow any object in the array
    .min(1)
    .required()
    .messages({
        'string.base': `{{#label}} should be a type of string`,
        'string.empty': `{{#label}} cannot be an empty field`,
        'any.required': `{{#label}} is a required field`,
        'array.base': `{{#label}} should be an array`,
        'array.min': `{{#label}} should contain at least 1 item`,
        'object.base': `{{#label}} should be of type object`,
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
        gender: Joi.string().required().valid('Male', 'Female', 'Other').messages({
            'string.empty': `"gender" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
            'any.only': 'Invalid gender value'
        }),
        visibility: Joi.string().required().valid('Private', 'Public').messages({
            'string.empty': `"visibility" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
            'any.only': 'Invalid visibility value'
        }),
        date_of_birth: Joi.date().required().messages({
            'string.empty': `"date of birth" cannot be an empty field`,
        }), // Add Joi validation for date_of_birth field
    city: Joi.string().trim().required().messages({
        'string.empty': `"city" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    // state: Joi.string().trim().required().messages({
    //     'string.empty': `"state" cannot be an empty field`,
    //     'string.trim': '{{#label}} must not have leading or trailing whitespace',
    // }),
    country: Joi.string().trim().required().messages({
        'string.empty': `"country" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    concert_artist: Joi.boolean().required(),
    bio: Joi.string().trim().required().messages({
        'string.empty': `"bio" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    profile_img: Joi.string().required(),
    verified: Joi.boolean().required(),
    genres: Joi.array()
    .items(Joi.string().trim()) // Allow any object in the array
    .min(1)
    .required()
    .messages({
        'string.base': `{{#label}} should be a type of string`,
        'string.empty': `{{#label}} cannot be an empty field`,
        'any.required': `{{#label}} is a required field`,
        'array.base': `{{#label}} should be an array`,
        'array.min': `{{#label}} should contain at least 1 item`,
        'object.base': `{{#label}} should be of type object`,
    }),
    facebook: Joi.string().regex(RegExp(urlRegex)).
        required()
        .messages({
            'string.pattern.base': `"facebook" should be a type of 'URL'`,
            'string.empty': `"facebook" cannot be an empty field`,
        }),
    twitter: Joi.string().regex(RegExp(urlRegex)).
        required()
        .messages({
            'string.pattern.base': `"twitter" should be a type of 'URL'`,
            'string.empty': `"twitter" cannot be an empty field`,
        }),
    // sportify: Joi.string().regex(RegExp(urlRegex)).
    //     required()
    //     .messages({
    //         'string.pattern.base': `"sportify" should be a type of 'URL'`,
    //         'string.empty': `"sportify" cannot be an empty field`,
    //     }),
    instagram: Joi.string().regex(RegExp(urlRegex)).
        required()
        .messages({
            'string.pattern.base': `"instagram" should be a type of 'URL'`,
            'string.empty': `"instagram" cannot be an empty field`,
        }),
    youtube: Joi.string().regex(RegExp(urlRegex)).
        required()
        .messages({
            'string.pattern.base': `"youtube" should be a type of 'URL'`,
            'string.empty': `"youtube" cannot be an empty field`,
        }),
    website: Joi.string().regex(RegExp(urlRegex)).
        required()
        .messages({
            'string.pattern.base': `"website" should be a type of 'URL'`,
            'string.empty': `"website" cannot be an empty field`,
        }),
    status: Joi.string().required().valid('Deactive', 'Active').messages({
            'string.empty': `"status" cannot be an empty field`,
            'string.trim': '{{#label}} must not have leading or trailing whitespace',
          }),
})

const validateUpdateUserArtistReq = Joi.object({
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
    username: Joi.string().trim().messages({
        'string.empty': `"username" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    artist_categories: Joi.array().items(Joi.string().trim()).messages({
        'string.empty': `"artist_categories" cannot be an empty field`,
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
    concert_artist: Joi.boolean(),
    visibility: Joi.boolean(),
    chat: Joi.string().trim().messages({
        'string.empty': `"chat" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    bio: Joi.string().trim().messages({
        'string.empty': `"bio" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    verified: Joi.boolean(),
    badges: Joi.array().items(Joi.string().trim()).messages({
        'string.empty': `"badges" cannot be an empty field`,
        'string.trim': '{{#label}} must not have leading or trailing whitespace',
    }),
    facebook: Joi.string().regex(RegExp(urlRegex))
        .messages({
            'string.pattern.base': `"facebook" should be a type of 'URL'`,
            'string.empty': `"facebook" cannot be an empty field`,
        }),
    twitter: Joi.string().regex(RegExp(urlRegex))
        .messages({
            'string.pattern.base': `"twitter" should be a type of 'URL'`,
            'string.empty': `"twitter" cannot be an empty field`,
        }),
    sportify: Joi.string().regex(RegExp(urlRegex))
        .messages({
            'string.pattern.base': `"sportify" should be a type of 'URL'`,
            'string.empty': `"sportify" cannot be an empty field`,
        }),
    instagram: Joi.string().regex(RegExp(urlRegex))
        .messages({
            'string.pattern.base': `"instagram" should be a type of 'URL'`,
            'string.empty': `"instagram" cannot be an empty field`,
        }),
    youtube: Joi.string().regex(RegExp(urlRegex))
        .messages({
            'string.pattern.base': `"youtube" should be a type of 'URL'`,
            'string.empty': `"youtube" cannot be an empty field`,
        }),
    website: Joi.string().regex(RegExp(urlRegex))
        .messages({
            'string.pattern.base': `"website" should be a type of 'URL'`,
            'string.empty': `"website" cannot be an empty field`,
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
    validateAddUserArtistReq, validateUpdateUserArtistReq, validateLoginReq, validateResetPasswordReq
}
