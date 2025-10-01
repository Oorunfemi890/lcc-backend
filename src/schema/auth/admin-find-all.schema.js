const Joi = require('joi');

const adminFindAllSchema  = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        role: Joi.string().valid("ADMIN", "SUPERADMIN", "MODERATOR").optional(),
        membershipType: Joi.string().optional(),
        active: Joi.boolean().optional(),
        search: Joi.string().optional(),
    })
};

module.exports = adminFindAllSchema  