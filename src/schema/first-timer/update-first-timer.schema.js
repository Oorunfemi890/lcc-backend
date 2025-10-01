const Joi = require('joi');

const getFirstTimer = {
    body: Joi.object({
        firstName: Joi.string().min(2).max(50).optional(),
        lastName: Joi.string().min(2).max(50).optional(),
        email: Joi.string().email().optional(),
        phoneNumber: Joi.string().pattern(/^[0-9]{7,15}$/).optional(),
        address: Joi.string().max(255).optional(),
        maritalStatus: Joi.string()
            .valid("single", "married", "divorced", "widowed")
            .optional(),
        ageGroup: Joi.string()
            .valid("child", "teen", "youth", "adult", "senior")
            .optional(),
        visitDate: Joi.date().iso().optional(),
        interestedInJoining: Joi.boolean().optional(),
        invitedBy: Joi.string().max(100).optional(),
        notes: Joi.string().max(2000).optional(),
    })
};

module.exports = getFirstTimer