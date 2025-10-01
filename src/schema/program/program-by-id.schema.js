const Joi = require('joi');

const programById = {
    params: Joi.object({
        id: Joi.number().integer().required(),
    })
};

module.exports = programById