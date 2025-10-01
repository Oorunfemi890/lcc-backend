const Joi = require('joi');

const memberBlock = {
    body: Joi.object({
        reason: Joi.string().default("Blocked by admin"),
        active: Joi.boolean(),

    }),

    params: Joi.object({
        id: Joi.string().uuid().required(),
    })
};

module.exports = memberBlock