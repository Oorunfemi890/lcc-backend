const Joi = require('joi');

const programCreate = {
    body: Joi.object({
        name: Joi.string().min(3).max(255).required(),
        description: Joi.string().allow("", null),
        category: Joi.string().valid('youth', 'children', 'bible_study', 'sunday_fellowship', 'outreach', 'prayer', 'special_event', 'ministry').required(),
        frequency: Joi.string().valid('weekly', 'monthly', 'quarterly', 'annually', 'one_time').required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().min(Joi.ref("startDate")).required(),
        location: Joi.string().allow("", null),
        organizer: Joi.string().allow("", null),
        startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(), // HH:mm format
    })
};

module.exports = programCreate