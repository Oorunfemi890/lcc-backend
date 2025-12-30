const Joi = require('joi');

const updateCelebrant = {
    body: Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        celebrationType: Joi.string().valid("birthday", "baptism", "wedding", "graduation", "newborn", "anniversary", "promotion", "ordination", "other").optional(),
        celebrationDate: Joi.date().iso().optional(),
        contact: Joi.string().max(100).optional(),
        contactType: Joi.string().valid("phone", "email", "whatsapp").optional(),
        message: Joi.string().max(1000).optional(),
        isPublic: Joi.boolean().optional(),
        specialRequests: Joi.string().max(1000).optional(),
        photoUrl: Joi.string().uri().optional(),
        notes: Joi.string().max(2000).optional(),
        submittedBy: Joi.string().max(100).optional(),
        submitterContact: Joi.string().max(100).optional(),
        relationship: Joi.string().max(50).optional(),
        active: Joi.boolean().optional(),
    })
};

module.exports = updateCelebrant