const Joi = require('joi');

const serviceById = {
    params: Joi.object({
        id: Joi.number().integer().required(),

    })
};

module.exports = serviceById