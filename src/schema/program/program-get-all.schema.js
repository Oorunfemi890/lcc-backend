const Joi = require('joi');

const programGetAll = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        category: Joi.string().valid("youth", "children", "bible_study", "sunday_fellowship", "outreach", "prayer", "special_event", "ministry"),
        frequency: Joi.string().valid("daily", "weekly", "monthly", "quarterly", "yearly", "once"),
        status: Joi.string().valid("upcoming", "ongoing", "completed", "cancelled"),
        name: Joi.string().allow("", null),
    })
};

module.exports = programGetAll