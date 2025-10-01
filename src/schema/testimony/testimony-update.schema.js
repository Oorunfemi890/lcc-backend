const Joi = require('joi');

const testimonyUpdate = {
    body: Joi.object({
        category: Joi.string().min(3).max(100),
        content: Joi.string().min(5).max(2000),
        isPublic: Joi.boolean(),
        sharedInService: Joi.boolean(),
        active: Joi.boolean(),
        memberId: Joi.number().integer(),
    })
};

module.exports = testimonyUpdate