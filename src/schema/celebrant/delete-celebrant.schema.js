const Joi = require('joi');

const deleteCelebrant = {
    params: Joi.object({
        id: Joi.string().uuid().required(),
    })
};

module.exports = deleteCelebrant