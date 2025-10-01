const Joi = require('joi');

const adminChangePassword = {
    body: Joi.object({
        oldPassword: Joi.string().min(6).max(50).required(),
        newPassword: Joi.string().min(6).max(50).required(),
        confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
            "any.only": "Passwords do not match",
        }),
        token: Joi.string().required(),
        
    })
};

module.exports = adminChangePassword;