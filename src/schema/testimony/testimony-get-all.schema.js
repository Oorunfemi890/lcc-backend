const Joi = require('joi');

const testimonyGetAll = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        category: Joi.string().min(3).max(100),
        isPublic: Joi.boolean(),
        sharedInService: Joi.boolean(),
        active: Joi.boolean(),
        memberId: Joi.number().integer(),
        content: Joi.string().min(2).max(255),
    })
};

module.exports = testimonyGetAll