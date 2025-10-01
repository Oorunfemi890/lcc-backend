const Joi = require('joi');

const createAdmin = {
    body: Joi.object({
        memberId: Joi.string().uuid().optional(),
        role: Joi.string().valid("ADMIN", "SUPER_ADMIN", "EDITOR","EDITOR").default("ADMIN"),
    }).required()
};

module.exports = createAdmin;