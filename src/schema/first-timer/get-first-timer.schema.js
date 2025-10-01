const Joi = require('joi');

const getFirstTimer = {
    params: Joi.object({
        id: Joi.string().uuid().required(),
    })
};

module.exports = getFirstTimer