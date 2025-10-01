const Joi = require('joi');

const programGetAll = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        category: Joi.string().valid("worship", "teaching", "prayer", "youth", "children", "general"),
        frequency: Joi.string().valid("daily", "weekly", "monthly", "quarterly", "yearly", "once"),
        name: Joi.string().allow("", null), 
    })
};

module.exports = programGetAll