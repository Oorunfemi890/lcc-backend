const Joi = require('joi');

const deleteAdmin = {
    Params: Joi.object({
        id: Joi.string().uuid().required(),

    })
};

module.exports = deleteAdmin  