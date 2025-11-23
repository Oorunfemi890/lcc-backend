const Joi = require('joi');

const memberGetChildren = {
    query: Joi.object({
        parentId: Joi.string().uuid().required(),
    })
};

module.exports = memberGetChildren;
