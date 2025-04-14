const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

// Custom URLs validation function for avatars and item images
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// Validate clothing item body when an item is created
const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid URL',
    }),

    weather: Joi.string().valid("hot", "warm", "cold").required().messages({
      "any.only": 'The "weather" field must be one of "hot", "warm", or "cold"',
      "string.empty": 'The "weather" field must not be empty',
    }),
  }),
});

// Validate user info body when a user is created
const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
      "any.required": 'The "name" field is required',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      "string.empty": 'The "avatar" field must be filled in',
      "any.required": 'The "avatar" field is required',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
    email: Joi.string().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "any.required": 'The "email" field is required',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
      "any.required": 'The "password" field is required',
    }),
  }),
});

// Validate authentication when a user logs in
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "any.required": 'The "email" field is required',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
      "any.required": 'The "password" field is required',
    }),
  }),
});

// Validate user and clothing items IDs when they are accessed
const validateID = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.hex": 'The "id" field must be a valid hexadecimal',
      "string.length": 'The "id" field must be 24 characters long',
      "any.required": 'The "id" field is required',
    }),
  }),
});

// User update validatation (PATCH /users/me)
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": 'The minimum length of the "name" field is 2 characters',
      "string.max": 'The maximum length of the "name" field is 30 characters',
      "string.empty": 'The "name" field must not be empty',
      "any.required": 'The "name" field is required',
    }),
    avatar: Joi.string().custom(validateURL).required().messages({
      "string.empty": 'The "avatar" field must not be empty',
      "any.required": 'The "avatar" field is required',
      "string.uri": 'The "avatar" field must be a valid URL',
    }),
  }),
});

module.exports = {
  validateURL,
  validateCardBody,
  validateUserInfo,
  validateUserLogin,
  validateID,
  validateUserUpdate,
};
