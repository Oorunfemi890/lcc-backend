const Joi = require('joi');

const serviceGetAll = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
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
        active: Joi.boolean(),
        title: Joi.string().allow("", null),
    })
};

module.exports = serviceGetAll