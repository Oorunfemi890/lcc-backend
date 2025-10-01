const Joi = require('joi');

const programUpdate = {
    body: Joi.object({
    name: Joi.string().min(3).max(255),
    description: Joi.string().allow("", null),
    category: Joi.string().valid("worship", "teaching", "prayer", "youth", "children", "general"),
    frequency: Joi.string().valid("daily", "weekly", "monthly", "quarterly", "yearly", "once"),
    startDate: Joi.date(),
    endDate: Joi.date().min(Joi.ref("startDate")),
    location: Joi.string().allow("", null),
    organizer: Joi.string().allow("", null),
    })
};

module.exports = programUpdate