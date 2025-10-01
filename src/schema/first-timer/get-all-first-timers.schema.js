const Joi = require('joi');

const getAllFirstTimers = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        maritalStatus: Joi.string()
            .valid("single", "married", "divorced", "widowed")
            .optional(),
        ageGroup: Joi.string()
            .valid("child", "teen", "youth", "adult", "senior")
            .optional(),
        visitDate: Joi.date().iso().optional(),
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().optional(),
        interestedInJoining: Joi.boolean().optional(),
    })
};

module.exports = getAllFirstTimers