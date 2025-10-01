const Joi = require('joi');

const memberCreate = {
    body: Joi.object({
        firstName: Joi.string().min(2).max(100).required(),
        lastName: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().pattern(/^[0-9]{7,15}$/).required(),
        countryCode: Joi.string().default("+234"),
        address: Joi.string().allow(null, ""),
        dateOfBirth: Joi.date().allow(null),
        maritalStatus: Joi.string().valid("single", "married", "divorced", "widowed").allow(null),
        occupation: Joi.string().allow(null, ""),
        interests: Joi.array().items(Joi.string()).allow(null),
        membershipType: Joi.string().valid("member", "admin", "pastor", "minister").default("member"),
        emergencyContactName: Joi.string().allow(null, ""),
        emergencyContactPhone: Joi.string().pattern(/^[0-9]{7,15}$/).allow(null, ""),
        emergencyContactRelationship: Joi.string().allow(null, ""),
        profilePicture: Joi.string().uri().allow(null, ""),
        notes: Joi.string().allow(null, ""),
    })
};

module.exports = memberCreate