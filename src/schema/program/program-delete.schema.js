const Joi = require('joi');

const deleteProgram = {
    params: Joi.object({
        id: Joi.string().uuid().required(),
    })
};

module.exports = deleteProgram