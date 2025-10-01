const Joi = require('joi');

const memberById = {
    params: Joi.object({
        id: Joi.string().uuid().required(),
    })
};

module.exports = memberById