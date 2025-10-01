const Joi = require('joi');

const adminForgotPassword = {
    body: Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),

    })
};

module.exports = adminForgotPassword