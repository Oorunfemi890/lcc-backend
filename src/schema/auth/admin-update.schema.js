const Joi = require('joi');

const updateAdmin = {
    query: Joi.object({
        role: Joi.string().valid("ADMIN", "SUPERADMIN", "MODERATOR").optional(),
        active: Joi.boolean().optional(),
    })
};

module.exports = updateAdmin  