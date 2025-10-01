const Joi = require('joi');

const getAllFirstTimers = {
    prams: Joi.object({
        id: Joi.string().uuid().required(),
    })
};

module.exports = getAllFirstTimers