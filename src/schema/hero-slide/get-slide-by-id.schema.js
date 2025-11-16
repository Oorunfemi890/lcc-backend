const Joi = require('joi');

const getSlideById = {
    params: Joi.object({
        id: Joi.string()
            .valid("slide-1", "slide-2", "slide-3")
            .required()
            .messages({
                "any.only": "Slide ID must be slide-1, slide-2, or slide-3",
                "any.required": "Slide ID is required",
            })
    }),
};

module.exports = getSlideById 