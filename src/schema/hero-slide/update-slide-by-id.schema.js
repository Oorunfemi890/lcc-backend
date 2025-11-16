const Joi = require('joi');

const updateSlide = {
    params: Joi.object({
        id: Joi.string()
            .valid("slide-1", "slide-2", "slide-3")
            .required()
            .messages({
                "any.only": "Slide ID must be slide-1, slide-2, or slide-3",
                "any.required": "Slide ID is required",
            }),
    }),
    body: Joi.object({
        title: Joi.string().min(3).max(200).optional().messages({
            "string.min": "Title must be at least 3 characters",
            "string.max": "Title cannot exceed 200 characters",
        }),
        subtitle: Joi.string().min(3).max(500).optional().messages({
            "string.min": "Subtitle must be at least 3 characters",
            "string.max": "Subtitle cannot exceed 500 characters",
        }),
        cta: Joi.string().min(2).max(50).optional().messages({
            "string.min": "CTA must be at least 2 characters",
            "string.max": "CTA cannot exceed 50 characters",
        }),
    })
        .or("title", "subtitle", "cta", "ctaIcon")
        .messages({
            "object.missing": "At least one field (title, subtitle, cta, ctaIcon) must be provided",
        }),
};


module.exports = updateSlide 