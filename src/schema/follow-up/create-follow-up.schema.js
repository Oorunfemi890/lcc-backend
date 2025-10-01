const Joi = require('joi');

const createFollowUp = {
    body: Joi.object({
        firstTimerId: Joi.string().uuid().required(),
        assignedToMemberId: Joi.string().uuid().optional(),
        followUpType: Joi.string()
            .valid("call", "visit", "meeting", "prayer", "counseling", "other")
            .required(),
        scheduledDate: Joi.date().iso().required(),
        notes: Joi.string().max(2000).optional(),
        nextFollowUpDate: Joi.date().iso().optional(),
    })
};

module.exports = createFollowUp