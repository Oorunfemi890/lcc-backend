const Joi = require('joi');

const createAdmin = {
    body: Joi.object({
        memberId: Joi.string().uuid().required(),
        role: Joi.string().valid("ADMIN", "SUPER_ADMIN", "EDITOR", "VIEWER").default("VIEWER"),
    }).required()
};

module.exports = createAdmin;