const Joi = require('joi');

const adminResetProfile = {
    body: Joi.object({
        phoneNumber: Joi.string()
            .pattern(/^[0-9]{7,15}$/)
            .optional()
            .messages({
                "string.pattern.base": "Phone number must be between 7 and 15 digits",
            }),

        firstName: Joi.string().min(2).max(50).optional(),
        lastName: Joi.string().min(2).max(50).optional(),
        address: Joi.string().max(255).optional(),
        countryCode: Joi.string().min(1).max(5).optional(),
    }),

    Params: Joi.object({
        id: Joi.string().uuid().required(),

    })
};

module.exports = adminResetProfile