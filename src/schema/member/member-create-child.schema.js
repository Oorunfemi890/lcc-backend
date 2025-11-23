const Joi = require('joi');

const memberCreateChild = {
    body: Joi.object({
        parentId: Joi.string().uuid().optional(),
        firstName: Joi.string().min(2).max(100).required(),
        lastName: Joi.string().min(2).max(100).required(),
        dateOfBirth: Joi.date().allow(null),
        gender: Joi.string().valid("male", "female", "other").allow(null),
        membershipType: Joi.string().valid(
            "Youth",
            "Children's",
            "Choir",
            "Media & Audio Visual",
            "Ushering",
            "Prayer",
            "Outreach & Evangelism",
            "Hospitality",
            "Counseling",
            "Men's Fellowship",
            "Women's Fellowship",
            "Sunday School",
            "Other"
        ).default("Children's"),
    })
};

module.exports = memberCreateChild;
