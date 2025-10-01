const Joi = require('joi');

const memberUpdate = {
    query: Joi.object({
        firstName: Joi.string().min(2).max(100),
        lastName: Joi.string().min(2).max(100),
        email: Joi.string().email(),
        phoneNumber: Joi.string().pattern(/^[0-9]{7,15}$/),
        countryCode: Joi.string(),
        address: Joi.string().allow(null, ""),
        dateOfBirth: Joi.date().allow(null),
        maritalStatus: Joi.string().valid("single", "married", "divorced", "widowed"),
        occupation: Joi.string().allow(null, ""),
        interests: Joi.array().items(Joi.string()),
        membershipType: Joi.string().valid("member", "admin", "pastor", "minister"),
        emergencyContactName: Joi.string().allow(null, ""),
        emergencyContactPhone: Joi.string().pattern(/^[0-9]{7,15}$/).allow(null, ""),
        emergencyContactRelationship: Joi.string().allow(null, ""),
        profilePicture: Joi.string().uri().allow(null, ""),
        notes: Joi.string().allow(null, ""),
        active: Joi.boolean(),
        blockReason: Joi.string().allow(null, ""),
    })
};

module.exports = memberUpdate