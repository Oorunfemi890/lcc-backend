const Joi = require("joi");

const resetPin = {
    body: Joi.object({
        phoneNumber: Joi.string().required().messages({
            "string.empty": "Phone number is required",
            "any.required": "Phone number is required",
        }),
        otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
            "string.empty": "OTP is required",
            "string.length": "OTP must be exactly 6 digits",
            "string.pattern.base": "OTP must contain only digits",
            "any.required": "OTP is required",
        }),
        newPin: Joi.string().min(4).max(6).pattern(/^\d+$/).required().messages({
            "string.empty": "New PIN is required",
            "string.min": "PIN must be at least 4 digits",
            "string.max": "PIN must be at most 6 digits",
            "string.pattern.base": "PIN must contain only digits",
            "any.required": "New PIN is required",
        }),
    })
};

module.exports = resetPin;
