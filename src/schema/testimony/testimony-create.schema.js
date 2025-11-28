const Joi = require('joi');

const testimonyCreate = {
    body: Joi.object({
        category: Joi.string().min(3).max(100).required(),
        content: Joi.string().min(5).max(2000).required(),
        isPublic: Joi.boolean().default(true),
        sharedInService: Joi.boolean().default(false),
        active: Joi.boolean().default(true),
        memberName: Joi.string().required(),
        dateOfExperience: Joi.date().required(),


    })
};

module.exports = testimonyCreate