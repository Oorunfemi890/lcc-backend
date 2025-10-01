const Joi = require('joi');

const updateCelebrant = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        name: Joi.string().optional(),
        celebrationType: Joi.string().valid("birthday", "anniversary", "graduation", "wedding", "other").optional(),
        isPublic: Joi.boolean().optional(),
        active: Joi.boolean().optional(),
    })
};

module.exports = updateCelebrant