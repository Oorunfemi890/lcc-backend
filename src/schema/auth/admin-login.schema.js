const Joi = require('joi');

const adminLogin = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
};

module.exports = adminLogin