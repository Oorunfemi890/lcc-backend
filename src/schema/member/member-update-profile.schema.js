
const Joi = require('joi');

const updateProfile = {
    body: Joi.object({
        firstName: Joi.string().min(2).max(100),
        lastName: Joi.string().min(2).max(100),
        occupation: Joi.string().allow(null, ""),
        address: Joi.string().allow(null, ""),
    }),

};

module.exports = updateProfile