const Joi = require('joi');

const serviceCreate = {
    body: Joi.object({
        title: Joi.string().min(3).max(255).required(),
        description: Joi.string().allow("", null),
        serviceType: Joi.string()
            .valid("sunday", "midweek", "special", "prayer", "thanksgiving", "general")
            .required(),
        frequency: Joi.string()
            .valid("daily", "weekly", "monthly", "quarterly", "yearly", "once")
            .required(),
        dayOfWeek: Joi.string().valid(
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday"
        ),
        serviceDate: Joi.date().required(),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // HH:mm format
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
        location: Joi.string().allow("", null),
        active: Joi.boolean().default(true),
    })
};

module.exports = serviceCreate