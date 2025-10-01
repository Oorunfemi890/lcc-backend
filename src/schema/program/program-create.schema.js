const Joi = require('joi');

const programCreate = {
    body: Joi.object({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().allow("", null),
        category: Joi.string().valid("worship", "teaching", "prayer", "youth", "children", "general").required(),
        frequency: Joi.string().valid("daily", "weekly", "monthly", "quarterly", "yearly", "once").required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().min(Joi.ref("startDate")).required(),
        location: Joi.string().allow("", null),
        organizer: Joi.string().allow("", null),
    })
};

module.exports = programCreate