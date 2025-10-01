const Joi = require('joi');

const adminResetPassword = {
    body: Joi.object({
        newPassword: Joi.string().min(6).max(100).required(),
        token: Joi.string().required(),
    })
};

module.exports = adminResetPassword