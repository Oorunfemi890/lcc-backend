import Joi from "joi";

export const editProfileSchema = Joi.object({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    countryCode: Joi.string().required()
});