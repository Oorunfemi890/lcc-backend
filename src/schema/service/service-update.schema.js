const Joi = require('joi');

const serviceUpdate = {
    body: Joi.object({
        title: Joi.string().min(3).max(255),
        description: Joi.string().allow("", null),
        serviceType: Joi.string().valid("sunday", "midweek", "special", "prayer", "thanksgiving", "general"),
        frequency: Joi.string().valid("daily", "weekly", "monthly", "quarterly", "yearly", "once"),
        dayOfWeek: Joi.string().valid(
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday"
        ),
        serviceDate: Joi.date(),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        location: Joi.string().allow("", null),
        active: Joi.boolean(),
    })
};

module.exports = serviceUpdate