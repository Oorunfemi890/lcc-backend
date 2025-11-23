const Joi = require("joi");

const memberLookup = {
    body: Joi.object({
        phoneNumber: Joi.string().required().messages({
            "string.empty": "Phone number is required",
            "any.required": "Phone number is required",
        }),
        dateOfBirth: Joi.date().iso().required().messages({
            "date.base": "Date of birth must be a valid date",
            "any.required": "Date of birth is required",
        }),
        securityPin: Joi.string().required().messages({
            "string.empty": "Security PIN is required",
            "any.required": "Security PIN is required",
        }),
    })
};

module.exports = memberLookup;
