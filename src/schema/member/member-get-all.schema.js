const Joi = require('joi');

const memberGetAll = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        search: Joi.string().allow(null, ""),
        active: Joi.boolean().truthy("true").falsy("false"),
        membershipType: Joi.string().valid("member", "admin", "pastor", "minister"),
    })
};

module.exports = memberGetAll