const Joi = require('joi');

const deleteFollowUp = {
    params: Joi.object({
        id: Joi.string().uuid().required(),

    })
};

module.exports = deleteFollowUp