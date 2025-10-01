const Joi = require('joi');

const findAminById = {
    Params: Joi.object({
        id: Joi.string().uuid().required(),

    })
};

module.exports = findAminById  