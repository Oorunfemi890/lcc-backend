const Joi = require('joi');

const updateFollowUp = {
    body: Joi.object({
        followUpType: Joi.string()
            .valid("call", "visit", "meeting", "prayer", "counseling", "other")
            .optional(),
        scheduledDate: Joi.date().iso().optional(),
        notes: Joi.string().max(2000).optional(),
        status: Joi.string()
            .valid("pending", "completed", "cancelled")
            .optional(),
        nextFollowUpDate: Joi.date().iso().optional(),
        assignedToMemberId: Joi.string().uuid().optional(),
    })
};

module.exports = updateFollowUp