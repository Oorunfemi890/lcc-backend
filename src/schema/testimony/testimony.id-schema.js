const Joi = require('joi');

const testimonyById = {
    body: Joi.object({
        id: Joi.number().integer().required(),
    })
};

module.exports = testimonyById