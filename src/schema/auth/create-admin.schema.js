const Joi = require('joi');

const createAdmin = {
    body: Joi.object({
        memberId: Joi.string().uuid().optional(),
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        password: Joi.string().min(6).max(100).required(),
        phoneNumber: Joi.string().pattern(/^[0-9]{7,15}$/).required(),
        address: Joi.string().max(255).optional(),
        email: Joi.string().email().required(),
        countryCode: Joi.string().min(1).max(5).required(),
        role: Joi.string().valid("ADMIN", "SUPERADMIN", "MODERATOR").default("ADMIN"),
    }).required()
};

module.exports = createAdmin;