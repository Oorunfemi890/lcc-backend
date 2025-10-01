const Joi = require('joi');

const getAllFollowUps = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        status: Joi.string()
            .valid("pending", "completed", "cancelled")
            .optional(),
        followUpType: Joi.string()
            .valid("call", "visit", "meeting", "prayer", "counseling", "other")
            .optional(),
        assignedToMemberId: Joi.string().uuid().optional(),
        firstTimerId: Joi.string().uuid().optional(),
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().optional(),
    })
};

module.exports = getAllFollowUps