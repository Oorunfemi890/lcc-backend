const Joi = require("joi");

const requestPinReset = {
    body: Joi.object({
        phoneNumber: Joi.string().required().messages({
            "string.empty": "Phone number is required",
            "any.required": "Phone number is required",
        }),
    })
};

module.exports = requestPinReset;
